import {
	deleteSection,
	getSections,
	updateSection,
} from "../controllers/sections"
import { Router } from "express"
import validate from "../middleware/validation"
import {
	updateSectionParamsSchema,
	updateSectionSchema,
} from "../schemas/sections"

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
