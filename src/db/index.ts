import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as auth from "./schema/auth"
import * as courses from "./schema/courses"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")

const db = drizzle(process.env.DATABASE_URL, {
	schema: {
		...auth,
		...courses,
	},
})

export default db
