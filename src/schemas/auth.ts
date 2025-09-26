import z from "zod"

export const sessionOutputSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	expiresAt: z.date(),
	user: z.object({
		id: z.number(),
		createdAt: z.date(),
		updatedAt: z.date(),
		name: z.string(),
		email: z.string(),
		githubId: z.string().nullable(),
		googleId: z.string().nullable(),
		linkedinId: z.string().nullable(),
		role: z.object({
			id: z.number(),
			name: z.string(),
			isDefault: z.boolean(),
		}),
	}),
})

export const registerSchema = z.object({
	name: z.string().min(3).max(48),
	email: z.email().toLowerCase(),
	password: z.string().min(6).max(64),
})

export const loginSchema = z.object({
	email: z.email().toLowerCase(),
	password: z.string().min(6).max(64),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type SessionOutputSchema = z.infer<typeof sessionOutputSchema>
