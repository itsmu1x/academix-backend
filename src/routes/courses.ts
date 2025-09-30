import { createCourse, getCourses } from "src/controllers/courses"
import { Router } from "express"
import validate from "src/middleware/validation"
import { createCourseSchema } from "src/schemas/courses"

const router = Router()

router.get("/", getCourses)
router.post("/", validate(createCourseSchema), createCourse)

export default router
