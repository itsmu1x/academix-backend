import { getSections, updateSection } from "src/controllers/sections"
import { Router } from "express"
import validate from "src/middleware/validation"
import { updateSectionSchema } from "src/schemas/sections"

const router = Router()

router.get("/", getSections)
router.put("/:id", validate(updateSectionSchema, "params"), updateSection)

export default router
