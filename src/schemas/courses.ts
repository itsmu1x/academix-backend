import { z } from "zod"

export const createCourseSchema = z.object({
	title: z.string(),
	description: z.string(),
	slug: z.string().trim(),
	categoryId: z.number().positive(),
})

export const deleteCourseSchema = z.object({
	id: z.coerce.number().positive(),
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>
export type DeleteCourseSchema = z.infer<typeof deleteCourseSchema>
