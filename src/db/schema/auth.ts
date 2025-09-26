import { relations } from "drizzle-orm"
import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"

export const rolesTable = pgTable("roles", {
	id: serial().primaryKey(),
	name: varchar({ length: 32 }).notNull().unique(),
	bits: text().notNull(),
	isDefault: boolean("is_default").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const usersTable = pgTable("users", {
	id: serial().primaryKey(),
	name: varchar({ length: 48 }).notNull(),
	email: varchar({ length: 72 }).notNull().unique(),
	password: varchar({ length: 128 }).notNull(),
	roleId: integer()
		.references(() => rolesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	githubId: varchar({ length: 32 }),
	googleId: varchar({ length: 32 }),
	linkedinId: varchar({ length: 32 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const sessionsTable = pgTable("sessions", {
	id: varchar({ length: 72 }).primaryKey(),
	userId: integer()
		.references(() => usersTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	expiresAt: timestamp("expires_at").notNull(),
})

export const userRelations = relations(usersTable, ({ one }) => ({
	role: one(rolesTable, {
		fields: [usersTable.roleId],
		references: [rolesTable.id],
	}),
	sessions: one(sessionsTable, {
		fields: [usersTable.id],
		references: [sessionsTable.userId],
	}),
}))

export const roleRelations = relations(rolesTable, ({ many }) => ({
	users: many(usersTable),
}))

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
	}),
}))

export type Session = typeof sessionsTable.$inferSelect
export type User = typeof usersTable.$inferSelect
export type Role = typeof rolesTable.$inferSelect
