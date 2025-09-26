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

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
