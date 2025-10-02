import { generateState, GitHub } from "arctic"
import axios from "axios"
import { RedirectError } from "src/middleware/error-handler"
import z from "zod"
import type { Request } from "express"
import db from "src/db"
import { sessionsTable, usersTable } from "src/db/schema/auth"
import { eq } from "drizzle-orm"
import { generateSessionId, sha256 } from "./sessions"

export const profileSchema = z.object({
	provider: z.enum(["github", "google", "linkedin"]),
	id: z.any().transform((val) => String(val)),
	email: z.email().toLowerCase(),
	name: z.string().min(1),
})

export type OAuthProfile = z.infer<typeof profileSchema>

export const gh = new GitHub(
	process.env.GITHUB_CLIENT_ID!,
	process.env.GITHUB_CLIENT_SECRET!,
	`${process.env.ORIGIN}/auth/github/callback`
)

export function githubAuthorizationUrl(): [string, string] {
	const state = generateState()
	const url = gh.createAuthorizationURL(state, ["read:user", "user:email"])

	return [url.toString(), state]
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
