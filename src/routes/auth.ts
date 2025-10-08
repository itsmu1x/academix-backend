import validate from "../middleware/validation"
import { login, logout, me, register } from "../controllers/auth"
import { Router } from "express"
import { loginSchema, registerSchema } from "../schemas/auth"
import { authenticated, unauthenticated } from "../middleware/auth"

const router = Router()

router.post("/register", validate(registerSchema), unauthenticated, register)
router.post("/login", validate(loginSchema), unauthenticated, login)
router.post("/logout", authenticated, logout)
router.get("/me", authenticated, me)

export default router
