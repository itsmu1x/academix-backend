import {
	createCourse,
	deleteCourse,
	getCourse,
	getCourses,
} from "src/controllers/courses"
import {
	createSectionSchema,
	getCourseSectionsSchema,
} from "src/schemas/sections"
import { courseParamsSchema, createCourseSchema } from "src/schemas/courses"
import { createSection, getCourseSections } from "src/controllers/sections"
import { Router } from "express"
import validate from "src/middleware/validation"

const router = Router()

router.get("/", getCourses)
router.post("/", validate(createCourseSchema), createCourse)
router.get("/:id", validate(courseParamsSchema, "params"), getCourse)
router.get(
	"/:courseId/sections",
	validate(getCourseSectionsSchema, "params"),
	getCourseSections
)
router.post(
	"/:courseId/sections",
	validate(getCourseSectionsSchema, "params"),
	validate(createSectionSchema),
	createSection
)
router.delete("/:id", validate(courseParamsSchema, "params"), deleteCourse)

export default router
