import { createSection, getSections } from "src/controllers/sections"
import { createSectionSchema } from "src/schemas/sections"
import { Router } from "express"
import validate from "src/middleware/validation"

const router = Router()

router.get("/", getSections)
router.post("/", validate(createSectionSchema), createSection)

export default router
