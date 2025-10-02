import type { GithubCallbackSchema, RegisterSchema } from "src/schemas/auth"
import type { TypedRequest, TypedRequestWithQuery } from "src/types/express"
import type { Request, Response } from "express"
import { sessionsTable, usersTable } from "src/db/schema/auth"
import { AppError, RedirectError } from "src/middleware/error-handler"
import { cookieOptions, generateSessionId, sha256 } from "src/utils/sessions"
import {
	GITHUB_STATE_COOKIE_NAME,
	SALT_ROUNDS,
	SESSION_COOKIE_NAME,
} from "src/utils/constants"
import bcryptjs from "bcryptjs"
import db from "src/db"
import { eq } from "drizzle-orm"
import {
	authenticate,
	githubAuthorizationUrl,
	githubUserize,
} from "src/utils/oauth"

export const userize = async () => {}

export const github = async (req: Request, res: Response) => {
	const [url, state] = githubAuthorizationUrl()

	return res
		.cookie(
			GITHUB_STATE_COOKIE_NAME,
			state,
			cookieOptions({ maxAge: 60000 })
		)
		.redirect(url.toString())
}

export const githubCallback = async (
	req: TypedRequestWithQuery<GithubCallbackSchema>,
	res: Response
) => {
	const state = req.signedCookies[GITHUB_STATE_COOKIE_NAME]
	if (state !== req._query.state)
		throw new RedirectError("auth.invalid_state")

	const profile = await githubUserize(req._query.code)
	if (!profile) throw new RedirectError("auth.general_error")

	const sessionId = await authenticate(req, profile)
	const response = res.clearCookie(GITHUB_STATE_COOKIE_NAME)

	if (sessionId)
		response.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions())
	return response.redirect(process.env.FRONTEND_URL!)
}

export const register = async (
	req: TypedRequest<RegisterSchema>,
	res: Response
) => {
	return await db.transaction(async (tx) => {
		const user = await tx.query.usersTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, req.body.email)
			},
		})

		if (user) throw new AppError("auth.email_in_use", 400)

		const role = await tx.query.rolesTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.isDefault, true)
			},
		})

		// No need to handle this error, it should never happen ig.. hopefully..
		if (!role) throw new Error()

		const password = await bcryptjs.hash(req.body.password, SALT_ROUNDS)
		const [{ id: userId }] = await tx
			.insert(usersTable)
			.values({
				name: req.body.name,
				email: req.body.email,
				roleId: role.id,
				password,
			})
			.returning()

		const sessionId = generateSessionId()
		await tx.insert(sessionsTable).values({
			userId,
			id: await sha256(sessionId),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		})

		return res
			.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions())
			.json({
				message: req.t("auth.registered_successfully"),
			})
	})
}

export const login = async (req: Request, res: Response) => {
	return await db.transaction(async (tx) => {
		const user = await tx.query.usersTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, req.body.email)
			},
		})

		if (!user || !user.password)
			throw new AppError("auth.invalid_credentials", 400)
		if (!(await bcryptjs.compare(req.body.password, user.password)))
			throw new AppError("auth.invalid_credentials", 400)

		const sessionId = generateSessionId()
		await tx.insert(sessionsTable).values({
			userId: user.id,
			id: await sha256(sessionId),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		})

		return res
			.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions())
			.json({
				message: req.t("auth.logged_in_successfully"),
			})
	})
}

export const logout = async (req: Request, res: Response) => {
	return await db.transaction(async (tx) => {
		await tx
			.delete(sessionsTable)
			.where(eq(sessionsTable.id, req.session.id))

		return res
			.clearCookie(SESSION_COOKIE_NAME)
			.json({ message: req.t("auth.logged_out_successfully") })
	})
}

export const me = async (req: Request, res: Response) =>
	res.json(req.session.user)
