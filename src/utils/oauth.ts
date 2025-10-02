import {
	generateCodeVerifier,
	generateState,
	GitHub,
	Google,
	LinkedIn,
} from "arctic"
import axios from "axios"
import { RedirectError } from "src/middleware/error-handler"
import z from "zod"
import type { Request } from "express"
import db from "src/db"
import { sessionsTable, usersTable } from "src/db/schema/auth"
import { eq } from "drizzle-orm"
import { generateSessionId, sha256 } from "./sessions"
import { decodeJwt } from "jose"

export const profileSchema = z.object({
	provider: z.enum(["github", "google", "linkedin"]),
	id: z.any().transform((val) => String(val)),
	email: z.email().toLowerCase(),
	name: z.string().min(1),
})

export type OAuthProfile = z.infer<typeof profileSchema>

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.ORIGIN}/auth/google/callback`
)

export const gh = new GitHub(
	process.env.GITHUB_CLIENT_ID!,
	process.env.GITHUB_CLIENT_SECRET!,
	`${process.env.ORIGIN}/auth/github/callback`
)

export const linkedin = new LinkedIn(
	process.env.LINKEDIN_CLIENT_ID!,
	process.env.LINKEDIN_CLIENT_SECRET!,
	`${process.env.ORIGIN}/auth/linkedin/callback`
)

export const linkedinAuthorizationUrl = () => {
	const state = generateState()
	const url = linkedin.createAuthorizationURL(state, [
		"openid",
		"email",
		"profile",
	])

	return [url.toString(), state]
}

export function googleAuthorizationUrl(): [string, string, string] {
	const state = generateState()
	const codeVerifier = generateCodeVerifier()
	const url = google.createAuthorizationURL(state, codeVerifier, [
		"openid",
		"email",
		"profile",
	])

	return [url.toString(), state, codeVerifier]
}

export async function linkedinUserize(
	code: string
): Promise<OAuthProfile | null> {
	try {
		const response = await linkedin.validateAuthorizationCode(code)
		const decoded = decodeJwt(response.idToken())

		return profileSchema.parse({
			...decoded,
			id: decoded.sub,
			name: decoded.given_name || decoded.name,
			provider: "linkedin",
		})
	} catch {
		return null
	}
}

export function githubAuthorizationUrl(): [string, string] {
	const state = generateState()
	const url = gh.createAuthorizationURL(state, ["read:user", "user:email"])

	return [url.toString(), state]
}

export async function googleUserize(
	code: string,
	codeVerifier: string
): Promise<OAuthProfile | null> {
	try {
		const response = await google.validateAuthorizationCode(
			code,
			codeVerifier
		)
		const { data } = await axios.get(
			"https://www.googleapis.com/oauth2/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${response.accessToken()}`,
				},
			}
		)

		return profileSchema.parse({
			...data,
			provider: "google",
		})
	} catch {
		return null
	}
}

export async function githubUserize(
	code: string
): Promise<OAuthProfile | null> {
	try {
		const response = await gh.validateAuthorizationCode(code)
		const { data } = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${response.accessToken()}`,
			},
		})

		if (!data.email) throw new RedirectError("auth.github_no_email")
		return profileSchema.parse({
			...data,
			provider: "github",
		})
	} catch (err) {
		console.error(err)
		if (err instanceof RedirectError) throw err
		return null
	}
}

export async function authenticate(request: Request, profile: OAuthProfile) {
	return db.transaction(async (tx) => {
		if (request.session) {
			if (!request.session.user[`${profile.provider}Id`]) {
				await tx
					.update(usersTable)
					.set({
						[`${profile.provider}Id`]: profile.id,
					})
					.where(eq(usersTable.id, request.session.user.id))
			} else {
				throw new RedirectError("auth.has_oauth_account")
			}
		} else {
			const user = await tx.query.usersTable.findFirst({
				where(fields, { eq, or }) {
					return or(
						eq(fields.email, profile.email),
						eq(fields[`${profile.provider}Id`], profile.id)
					)
				},
			})

			if (user) {
				user[`${profile.provider}Id`] &&
					(await tx
						.update(usersTable)
						.set({
							[`${profile.provider}Id`]: profile.id,
						})
						.where(eq(usersTable.id, user.id)))
			} else {
				const role = await tx.query.rolesTable.findFirst({
					where(fields, { eq }) {
						return eq(fields.isDefault, true)
					},
				})
				if (!role) throw new Error()

				const [newUser] = await tx
					.insert(usersTable)
					.values({
						name: profile.name,
						email: profile.email,
						password: null,
						[`${profile.provider}Id`]: profile.id,
						roleId: 1,
					})
					.returning({ id: usersTable.id })

				const sessionId = generateSessionId()
				await tx.insert(sessionsTable).values({
					userId: newUser.id,
					id: await sha256(sessionId),
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
				})

				return sessionId
			}
		}

		return null
	})
}
