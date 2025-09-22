import { Request, Response, NextFunction } from "express"

export const notFound = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const error = new Error(`Not Found - ${req.originalUrl}`)
	res.status(404).json({
		error: {
			message: `Route ${req.originalUrl} not found`,
			status: 404,
		},
	})
}
