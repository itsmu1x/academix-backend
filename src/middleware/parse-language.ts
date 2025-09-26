import type { Request, Response, NextFunction } from "express"
import {
	DEFAULT_LANGUAGE,
	languageSchema,
	translate,
} from "src/utils/translation"

export default function parseLanguage(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const language = req.headers["x-language"]
	req.language = languageSchema.safeParse(language).data ?? DEFAULT_LANGUAGE
	req.t = (key: string) => translate(key, req.language)
	next()
}
