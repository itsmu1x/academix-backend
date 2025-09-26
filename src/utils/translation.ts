import fs from "fs"
import path from "path"
import get from "get-value"
import { z } from "zod"

export const DEFAULT_LANGUAGE = "en"
export const LANGUAGES = ["ar", "en"]

interface Translations {
	[language: string]: Record<string, string>
}

class TranslationCache {
	private cache: Translations = {}
	private translationsPath: string

	constructor() {
		this.translationsPath = path.join(__dirname, "../translations")
	}

	private loadLanguage(language: string): Record<string, string> {
		if (this.cache[language]) return this.cache[language]

		try {
			const filePath = path.join(
				this.translationsPath,
				`${language}.json`
			)
			const content = fs.readFileSync(filePath, "utf-8")
			const translations = JSON.parse(content)

			this.cache[language] = translations
			return translations
		} catch {
			return {}
		}
	}

	translate(key: string, language: string): string {
		const translations = this.loadLanguage(language)
		return get(translations, key, { default: key })
	}
}

const translationCache = new TranslationCache()

export const languageSchema = z.enum(LANGUAGES).default(DEFAULT_LANGUAGE)
export const translate = (
	key: string,
	language: z.infer<typeof languageSchema>
) => translationCache.translate(key, language)
