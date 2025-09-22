import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"

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
