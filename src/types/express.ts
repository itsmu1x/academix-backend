/// <reference types="./express.d.ts" />
import type { Request } from "express"

export type TypedRequest<T> = Request<{}, {}, T>
