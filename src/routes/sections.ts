import {
	deleteSection,
	getSections,
	updateSection,
} from "src/controllers/sections"
import { Router } from "express"
import validate from "src/middleware/validation"
import {
	updateSectionParamsSchema,
	updateSectionSchema,
} from "src/schemas/sections"

const router = Router()

router.get("/", getSections)
router.delete(
	"/:id",
	validate(updateSectionParamsSchema, "params"),
	deleteSection
)
router.put(
	"/:id",
	validate(updateSectionParamsSchema, "params"),
	validate(updateSectionSchema),
	updateSection
)

export default router
