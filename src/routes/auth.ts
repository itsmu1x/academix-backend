import validate from "src/middleware/validation"
import {
	github,
	githubCallback,
	google,
	googleCallback,
	login,
	logout,
	me,
	register,
} from "../controllers/auth"
import { Router } from "express"
import {
	githubCallbackSchema,
	googleCallbackSchema,
	loginSchema,
	registerSchema,
} from "src/schemas/auth"
import { authenticated, unauthenticated } from "src/middleware/auth"

const router = Router()

router.post("/register", validate(registerSchema), unauthenticated, register)
router.post("/login", validate(loginSchema), unauthenticated, login)
router.post("/logout", authenticated, logout)
router.get("/me", authenticated, me)

router.get("/github", github)
router.get(
	"/github/callback",
	validate(githubCallbackSchema, "query"),
	githubCallback
)

router.get("/google", google)
router.get(
	"/google/callback",
	validate(googleCallbackSchema, "query"),
	googleCallback
)

export default router
