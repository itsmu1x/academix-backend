import axios from "axios"
import { AppError } from "src/middleware/error-handler"
import { z } from "zod"

export const profileSchema = z.object({
	provider: z.enum(["github", "google", "linkedin"]),
	id: z.any().transform((val) => String(val)),
	email: z.email().toLowerCase(),
	name: z.string().min(1),
})

export type OAuthProfile = z.infer<typeof profileSchema>

export const getVideoDuration = async (url: string) => {
	const videoId = extractYouTubeId(url)
	if (!videoId) throw new AppError("sections.invalid_youtube_url", 400)

	const { data } = await axios.get<{
		items: { contentDetails: { duration: string } }[]
	}>(
		`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`
	)

	if (!data.items[0].contentDetails.duration)
		throw new AppError("sections.invalid_youtube_url", 400)

	return isoDurationToSeconds(data.items[0].contentDetails.duration)
}

function extractYouTubeId(url: string): string | null {
	try {
		const parsed = new URL(url)
		if (parsed.hostname.includes("youtube.com"))
			return parsed.searchParams.get("v")

		if (parsed.hostname === "youtu.be")
			return parsed.pathname.split("/")[1] || null

		return null
	} catch {
		return null
	}
}

function isoDurationToSeconds(iso: string) {
	const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)!
	const hours = parseInt(match[1] || "0", 10)
	const minutes = parseInt(match[2] || "0", 10)
	const seconds = parseInt(match[3] || "0", 10)
	return hours * 3600 + minutes * 60 + seconds
}
