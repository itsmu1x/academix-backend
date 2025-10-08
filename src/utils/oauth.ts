import { z } from "zod"

export const profileSchema = z.object({
	provider: z.enum(["github", "google", "linkedin"]),
	id: z.any().transform((val) => String(val)),
	email: z.email().toLowerCase(),
	name: z.string().min(1),
})

export type OAuthProfile = z.infer<typeof profileSchema>
