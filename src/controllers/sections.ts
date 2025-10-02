import type { CreateSectionSchema } from "src/schemas/sections"
import type { Request, Response } from "express"
import type { TypedRequest, TypedRequestWithParams } from "src/types/express"
import { sectionsTable } from "src/db/schema/courses"
import { AppError } from "src/middleware/error-handler"
import db from "src/db"

export const getSections = async (_req: Request, res: Response) => {
	const sections = await db.query.sectionsTable.findMany()
	res.json(sections)
}

export const createSection = async (
	req: TypedRequest<CreateSectionSchema, { courseId: number }>,
	res: Response
) => {
	const [section] = await db
		.insert(sectionsTable)
		.values({ ...req.body, ...req.params })
		.returning()
	if (!section) throw new AppError("sections.creation_failed", 500)
	res.json(section)
}

export const getCourseSections = async (
	req: TypedRequestWithParams<{ courseId: number }>,
	res: Response
) => {
	const sections = await db.query.sectionsTable.findMany({
		where(fields, { eq }) {
			return eq(fields.courseId, req.params.courseId)
		},
	})

	res.json(sections)
}
