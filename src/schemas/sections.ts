import { z } from "zod"

export const createSectionSchema = z.object({
	title: z.string(),
})

export const getCourseSectionsSchema = z.object({
	courseId: z.number().positive(),
})

export type CreateSectionSchema = z.infer<typeof createSectionSchema>
export type GetCourseSectionsSchema = z.infer<typeof getCourseSectionsSchema>
