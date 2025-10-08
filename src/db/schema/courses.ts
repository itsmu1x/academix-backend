import { relations } from "drizzle-orm"
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"

export const contentTypes = pgEnum("content_types", ["video", "quiz"])
export const questionTypes = pgEnum("question_types", [
	"multiple_choice",
	"true_false",
])
export const sectionTypes = pgEnum("section_types", ["draft", "published"])

export const categoriesTable = pgTable("categories", {
	id: serial().primaryKey(),
	slug: varchar({ length: 128 }).notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const categoriesTranslationsTable = pgTable("categories_translations", {
	id: serial().primaryKey(),
	categoryId: integer("category_id")
		.references(() => categoriesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	locale: varchar({ length: 3 }).notNull(),
	name: varchar({ length: 32 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const coursesTable = pgTable("courses", {
	id: serial().primaryKey(),
	title: varchar({ length: 32 }).notNull(),
	description: text().notNull(),
	slug: varchar({ length: 128 }).notNull().unique(),
	categoryId: integer()
		.references(() => categoriesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const sectionsTable = pgTable("courses_sections", {
	id: serial().primaryKey(),
	courseId: integer()
		.references(() => coursesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	type: sectionTypes().notNull().default("draft"),
	title: varchar({ length: 32 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const contentsTable = pgTable("courses_contents", {
	id: serial().primaryKey(),
	sectionId: integer()
		.references(() => sectionsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	title: varchar({ length: 32 }).notNull(),
	type: contentTypes().notNull().default("video"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const videosTable = pgTable("courses_videos", {
	contentId: integer()
		.references(() => contentsTable.id, {
			onDelete: "cascade",
		})
		.notNull()
		.primaryKey(),
	url: text().notNull(),
	duration: integer().notNull(),
})

export const quizzesTable = pgTable("courses_quizzes", {
	contentId: integer()
		.references(() => contentsTable.id, {
			onDelete: "cascade",
		})
		.notNull()
		.primaryKey(),
	passingScore: integer("passing_score").notNull(),
})

export const quizQuestionsTable = pgTable("courses_quiz_questions", {
	id: serial().primaryKey(),
	quizId: integer()
		.references(() => quizzesTable.contentId, {
			onDelete: "cascade",
		})
		.notNull(),
	text: text().notNull(),
	type: questionTypes().notNull(),
	position: integer().notNull(),
})

export const quizQuestionOptionsTable = pgTable(
	"courses_quiz_question_options",
	{
		id: serial().primaryKey(),
		questionId: integer()
			.references(() => quizQuestionsTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		text: text().notNull(),
		isCorrect: boolean("is_correct").notNull(),
		position: integer().notNull(),
	}
)

export const categoriesTranslationsRelations = relations(
	categoriesTranslationsTable,
	({ one }) => ({
		category: one(categoriesTable, {
			fields: [categoriesTranslationsTable.categoryId],
			references: [categoriesTable.id],
		}),
	})
)

export const categoryRelations = relations(categoriesTable, ({ many }) => ({
	translations: many(categoriesTranslationsTable),
}))

export const courseRelations = relations(coursesTable, ({ one, many }) => ({
	category: one(categoriesTable, {
		fields: [coursesTable.categoryId],
		references: [categoriesTable.id],
	}),
	sections: many(sectionsTable),
}))

export const contentRelations = relations(contentsTable, ({ one, many }) => ({
	section: one(sectionsTable, {
		fields: [contentsTable.sectionId],
		references: [sectionsTable.id],
	}),
	video: one(videosTable, {
		fields: [contentsTable.id],
		references: [videosTable.contentId],
	}),
	quiz: one(quizzesTable, {
		fields: [contentsTable.id],
		references: [quizzesTable.contentId],
	}),
}))
