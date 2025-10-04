import { z } from "zod"

export const createCourseSchema = z.object({
	title: z.string(),
	description: z.string(),
	slug: z.string().trim(),
	categoryId: z.number().positive(),
})

export const courseParamsSchema = z.object({
	id: z.coerce.number().positive(),
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>
export type CourseParamsSchema = z.infer<typeof courseParamsSchema>
