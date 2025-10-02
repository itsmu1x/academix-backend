import { getSections } from "src/controllers/sections"
import { Router } from "express"

const router = Router()

router.get("/", getSections)

export default router
