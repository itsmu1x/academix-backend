import type { Request, Response, NextFunction } from "express"

export class AppError extends Error {
	statusCode: number
	constructor(message: string, statusCode: number = 500) {
		super(message)
		this.statusCode = statusCode
	}
}

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	const statusCode = err.statusCode || 500
	const message = err instanceof AppError ? req.t(err.message) : req.t("sww")
	console.error(err)

	res.status(statusCode).json({
		message,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	})
}
