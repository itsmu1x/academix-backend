import type { SessionOutputSchema } from "../schemas/auth"
import "express"

declare module "express-serve-static-core" {
	interface Request {
		session: SessionOutputSchema
		language: string
		t: (key: string) => string
		_query: any
	}
}
