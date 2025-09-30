import { readFile } from "fs/promises"
import { marked } from "marked"
import path from "path"

export const pathToMarkdown = async (pathname?: string | null) => {
	try {
		if (!pathname) pathname = "index"

		const mdPath = path.join(__dirname, `../md/${pathname}.md`)
		const data = await readFile(mdPath, "utf8")
		return markdownToHtml(await marked(data))
	} catch {
		return markdownToHtml(await marked("## Not found"))
	}
}

export const markdownToHtml = (markdown: string) => {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Academix Docs</title>
            <link rel="stylesheet" href="/docs.css" />
        </head>
        <body>
            <div class="container">
                ${markdown}
            </div>
        </body>
        </html>
    `
}
