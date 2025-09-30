import type { TypedRequestWithParams } from "src/types/express"
import { Router } from "express"
import validate from "src/middleware/validation"
import z from "zod"
import { pathToMarkdown } from "src/utils/markdown"

const router = Router()
const schema = z.object({ doc: z.string() })

router.get("/", async (_req, res) => {
	return res.send(await pathToMarkdown())
})

router.get(
	"/:doc",
	validate(schema, "params"),
	async (req: TypedRequestWithParams<z.infer<typeof schema>>, res) => {
		return res.send(await pathToMarkdown(req.params.doc))
	}
)

export default router
