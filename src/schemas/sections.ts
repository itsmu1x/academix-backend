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

const YOUTUBE_URL_REGEX =
	/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?]\S*)?$/

export const postVideoSchema = z.object({
	title: z.string(),
	url: z.url().regex(YOUTUBE_URL_REGEX),
})

export type CreateSectionSchema = z.infer<typeof createSectionSchema>
export type GetCourseSectionsSchema = z.infer<typeof getCourseSectionsSchema>
export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>
export type PostVideoSchema = z.infer<typeof postVideoSchema>
