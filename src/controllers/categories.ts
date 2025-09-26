import type { Request, Response } from "express"
import type { CreateCategorySchema } from "src/schemas/categories"
import type { TypedRequest } from "src/types/express"
import {
	categoriesTable,
	categoriesTranslationsTable,
} from "src/db/schema/courses"
import db from "src/db"

export const getCategories = async (_req: Request, res: Response) => {
	const categories = await db.query.categoriesTable.findMany({
		with: {
			translations: true,
		},
	})

	res.json(categories)
}

export const createCategory = async (
	req: TypedRequest<CreateCategorySchema>,
	res: Response
) => {
	return await db.transaction(async (tx) => {
		const { translations, ...rest } = req.body
		const [category] = await tx
			.insert(categoriesTable)
			.values(rest)
			.returning()

		for (const [locale, translation] of Object.entries(translations)) {
			await tx.insert(categoriesTranslationsTable).values({
				...translation,
				categoryId: category.id,
				locale,
			})
		}

		return res.json(category)
	})
}
