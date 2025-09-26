import { createCategory, getCategories } from "src/controllers/categories"
import { Router } from "express"
import validate from "src/middleware/validation"
import { createCategorySchema } from "src/schemas/categories"

const router = Router()

router.get("/", getCategories)
router.post("/", validate(createCategorySchema), createCategory)

export default router
