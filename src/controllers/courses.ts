import type {
	CreateCourseSchema,
	DeleteCourseSchema,
} from "src/schemas/courses"
import type { Request, Response } from "express"
import type { TypedRequest, TypedRequestWithParams } from "src/types/express"
import { coursesTable } from "src/db/schema/courses"
import { AppError } from "src/middleware/error-handler"
import db from "src/db"
import { eq } from "drizzle-orm"

export const getCourses = async (_req: Request, res: Response) => {
	const courses = await db.query.coursesTable.findMany({
		with: {
			category: {
				with: {
					translations: true,
				},
			},
		},
	})

	res.json(
		courses.map((course) => ({
			...course,
			category: {
				...course.category,
				translations: Object.fromEntries(
					course.category.translations.map((t) => [t.locale, t])
				),
			},
		}))
	)
}

export const createCourse = async (
	req: TypedRequest<CreateCourseSchema>,
	res: Response
) => {
	const [course] = await db.insert(coursesTable).values(req.body).returning()
	if (!course) throw new AppError("courses.creation_failed", 500)
	res.json(course)
}

export const deleteCourse = async (
	req: TypedRequestWithParams<DeleteCourseSchema>,
	res: Response
) => {
	await db.delete(coursesTable).where(eq(coursesTable.id, req.params.id))
	res.json({ message: req.t("courses.deleted_successfully") })
}
