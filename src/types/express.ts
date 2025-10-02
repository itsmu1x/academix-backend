/// <reference types="./express.d.ts" />
import type { Request } from "express"

export type TypedRequest<T, P = {}, Q = {}> = Request<P, {}, T, Q>
export type TypedRequestWithParams<T> = Request<T, {}, {}>
export type ValidationType = "body" | "params" | "query"
export interface TypedRequestWithQuery<T extends {}>
	extends Request<{}, {}, {}, T> {
	_query: T
}
