import type { Request, Response, NextFunction } from "express"
import { SESSION_COOKIE_NAME } from "src/utils/constants"
import { AppError } from "./error-handler"
import { sha256 } from "src/utils/sessions"
import db from "src/db"
import { sessionOutputSchema } from "src/schemas/auth"

export async function attachSession(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const sessionToken = req.signedCookies[SESSION_COOKIE_NAME]
	if (!sessionToken) return next()

	const hashed = await sha256(sessionToken)
	const session = await db.query.sessionsTable.findFirst({
		where(fields, { eq }) {
			return eq(fields.id, hashed)
		},
		with: {
			user: {
				with: {
					role: true,
				},
			},
		},
	})

	if (!session) return next()
	req.session = sessionOutputSchema.safeParse(session).data!
	next()
}

export async function authenticated(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	if (!req.session) throw new AppError("auth.unauthorized", 401)
	next()
}

export async function unauthenticated(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	if (req.session) throw new AppError("auth.unauthorized", 401)
	next()
}
