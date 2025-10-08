import type { Response, NextFunction } from "express"
import type { TypedRequest, ValidationType } from "src/types/express"
import type { z, ZodObject } from "zod"
import { AppError } from "./error-handler"

export default function validate(
	schema: ZodObject,
	type: ValidationType = "body"
) {
	return (
		req: TypedRequest<z.infer<typeof schema>>,
		_res: Response,
		next: NextFunction
	) => {
		const { error, data } = schema.safeParse(req[type])
		if (error) throw new AppError("validation_error", 400)
		req[type === "query" ? `_query` : type] = data
		next()
	}
}
