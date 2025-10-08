import {
	deleteSection,
	getContents,
	getSections,
	postVideo,
	updateSection,
} from "../controllers/sections"
import { Router } from "express"
import validate from "../middleware/validation"
import {
	postVideoSchema,
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
router.get(
	"/:id/contents",
	validate(updateSectionParamsSchema, "params"),
	getContents
)
router.post(
	"/:id/videos",
	validate(updateSectionParamsSchema, "params"),
	validate(postVideoSchema),
	postVideo
)

export default router
