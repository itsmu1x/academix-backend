import type { Request, Response, NextFunction } from "express"
import { AppError } from "./error-handler"

export const notFound = (
	_req: Request,
	_res: Response,
	next: NextFunction
): void => {
	next(new AppError("route_not_found", 404))
}
