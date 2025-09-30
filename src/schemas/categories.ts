import { z } from "zod"

export const createCategorySchema = z.object({
	slug: z.string(),
	translations: z.record(
		z.string(),
		z.object({
			name: z.string(),
		})
	),
})

export const deleteCategorySchema = z.object({
	id: z.number().positive(),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>
