import {
	createCourse,
	deleteCourse,
	getCourse,
	getCourses,
} from "../controllers/courses"
import {
	createSectionSchema,
	getCourseSectionsSchema,
} from "../schemas/sections"
import { courseParamsSchema, createCourseSchema } from "../schemas/courses"
import { createSection, getCourseSections } from "../controllers/sections"
import { Router } from "express"
import validate from "../middleware/validation"

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
