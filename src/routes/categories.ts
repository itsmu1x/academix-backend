import {
	createCategory,
	deleteCategory,
	getCategories,
} from "../controllers/categories"
import { Router } from "express"
import validate from "../middleware/validation"
import {
	createCategorySchema,
	deleteCategorySchema,
} from "../schemas/categories"

const router = Router()

router.get("/", getCategories)
router.post("/", validate(createCategorySchema), createCategory)
router.delete("/:id", validate(deleteCategorySchema, "params"), deleteCategory)

export default router
