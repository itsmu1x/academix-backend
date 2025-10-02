import { createCourse, getCourses } from "src/controllers/courses"
import { createSectionSchema } from "src/schemas/sections"
import { createCourseSchema } from "src/schemas/courses"
import { createSection } from "src/controllers/sections"
import { Router } from "express"
import validate from "src/middleware/validation"

const router = Router()

router.get("/", getCourses)
router.post("/", validate(createCourseSchema), createCourse)
router.post("/:id/sections", validate(createSectionSchema), createSection)

export default router
