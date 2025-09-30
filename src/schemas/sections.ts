import { z } from "zod"

export const createSectionSchema = z.object({
	courseId: z.number().positive(),
	title: z.string(),
})

export type CreateSectionSchema = z.infer<typeof createSectionSchema>
