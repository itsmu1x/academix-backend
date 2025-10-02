/// <reference types="./express.d.ts" />
import type { Request } from "express"

export type TypedRequest<T, P = {}> = Request<P, {}, T>
export type TypedRequestWithParams<T> = Request<T, {}, {}>
export type ValidationType = "body" | "params"
