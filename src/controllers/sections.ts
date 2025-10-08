import type { CreateSectionSchema, PostVideoSchema } from "../schemas/sections"
import type { Request, Response } from "express"
import type { TypedRequest, TypedRequestWithParams } from "../types/express"
import { contentsTable, sectionsTable, videosTable } from "../db/schema/courses"
import { AppError } from "../middleware/error-handler"
import db from "../db"
import { eq } from "drizzle-orm"
import { getVideoDuration } from "src/utils/oauth"

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

export const updateSection = async (
	req: TypedRequestWithParams<{ id: number }>,
	res: Response
) => {
	const [section] = await db
		.update(sectionsTable)
		.set(req.body)
		.where(eq(sectionsTable.id, req.params.id))
		.returning()

	if (!section) throw new AppError("sections.update_failed", 500)
	res.json(section)
}

export const deleteSection = async (
	req: TypedRequestWithParams<{ id: number }>,
	res: Response
) => {
	await db.delete(sectionsTable).where(eq(sectionsTable.id, req.params.id))
	res.json({ message: req.t("sections.deleted_successfully") })
}

export const postVideo = async (
	req: TypedRequest<PostVideoSchema, { id: number }>,
	res: Response
) => {
	const duration = await getVideoDuration(req.body.url)
	return db.transaction(async (tx) => {
		const [content] = await tx
			.insert(contentsTable)
			.values({
				title: req.body.title,
				type: "video",
				sectionId: req.params.id,
			})
			.returning()

		const [video] = await tx
			.insert(videosTable)
			.values({
				url: req.body.url,
				duration,
				contentId: content.id,
			})
			.returning()

		if (!video) throw new AppError("sections.video_post_failed", 500)

		return res.json({
			message: req.t("sections.video_posted_successfully"),
		})
	})
}
