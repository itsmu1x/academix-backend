import { z } from "zod"

export const createSectionSchema = z.object({
	title: z.string(),
})

export const getCourseSectionsSchema = z.object({
	courseId: z.coerce.number().positive(),
})

export const updateSectionSchema = z.object({
	title: z.string(),
})

export const updateSectionParamsSchema = z.object({
	id: z.coerce.number().positive(),
})

export type CreateSectionSchema = z.infer<typeof createSectionSchema>
export type GetCourseSectionsSchema = z.infer<typeof getCourseSectionsSchema>
export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>
