import { z } from "zod"

export const createSectionSchema = z.object({
	title: z.string().min(4),
})

export type CreateSectionSchema = z.infer<typeof createSectionSchema>
