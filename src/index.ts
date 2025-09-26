import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/error-handler"
import { notFound } from "./middleware/not-found"
import apiRoutes from "./routes"
import parseLanguage from "./middleware/parse-language"
import { attachSession } from "./middleware/auth"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(helmet())
app.use(
	cors({
		credentials: true,
		origin:
			process.env.NODE_ENV === "production"
				? process.env.FRONTEND_URL
				: "http://localhost:5173",
	})
)
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(parseLanguage)
app.use(attachSession)
app.use(apiRoutes)
app.use(notFound)
app.use(errorHandler)

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
		console.log(`${process.env.NODE_ENV || "development"} environment`)
	})
}

export default app
