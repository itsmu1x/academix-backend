import { CookieOptions } from "express"

export function generateSessionId(length: number = 16) {
	const bytes = crypto.getRandomValues(new Uint8Array(length))
	return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join(
		""
	)
}

export async function sha256(data: string) {
	const msgBuffer = new TextEncoder().encode(data)
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function cookieOptions(
	options: Partial<CookieOptions> = {}
): CookieOptions {
	return {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		maxAge: 1000 * 60 * 60 * 24 * 30,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		signed: true,
		...options,
	}
}
