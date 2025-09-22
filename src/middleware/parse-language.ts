import { Response, NextFunction } from "express"
import { Request } from "../types/api"

export default function parseLanguage(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const language = req.headers["x-language"]
	req.language = language && typeof language === "string" ? language : "en"
	next()
}
