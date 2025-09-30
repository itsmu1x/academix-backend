import { z } from "zod"

export const createCourseSchema = z.object({
	title: z.string(),
	description: z.string(),
	slug: z.string().trim(),
	categoryId: z.number().positive(),
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>
