import {
	createCategory,
	deleteCategory,
	getCategories,
} from "src/controllers/categories"
import { Router } from "express"
import validate from "src/middleware/validation"
import {
	createCategorySchema,
	deleteCategorySchema,
} from "src/schemas/categories"

const router = Router()

router.get("/", getCategories)
router.post("/", validate(createCategorySchema), createCategory)
router.delete("/:id", validate(deleteCategorySchema, "params"), deleteCategory)

export default router
