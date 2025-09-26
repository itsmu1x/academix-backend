import express from "express"
import authRoutes from "./auth"
import categoriesRoutes from "./categories"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/categories", categoriesRoutes)

export default router
