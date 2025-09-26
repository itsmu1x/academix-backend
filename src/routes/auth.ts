import validate from "src/middleware/validation"
import { login, logout, me, register } from "../controllers/auth"
import { Router } from "express"
import { loginSchema, registerSchema } from "src/schemas/auth"
import { authenticated, unauthenticated } from "src/middleware/auth"

const router = Router()

router.post("/register", validate(registerSchema), unauthenticated, register)
router.post("/login", validate(loginSchema), unauthenticated, login)
router.post("/logout", authenticated, logout)
router.get("/me", authenticated, me)

export default router
