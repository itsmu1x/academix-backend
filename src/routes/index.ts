import express from "express"
import authRoutes from "./auth"
import categoriesRoutes from "./categories"
import coursesRoutes from "./courses"
import sectionsRoutes from "./sections"
import docsRoutes from "./docs"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/categories", categoriesRoutes)
router.use("/courses", coursesRoutes)
router.use("/sections", sectionsRoutes)
router.use("/docs", docsRoutes)
// TODO: most of the routes are NOT protected, till next push i guess

export default router
