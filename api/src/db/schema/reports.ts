import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { timestamps } from "../columnHelper";

export const reports = sqliteTable("reports", {
	id: integer("id").primaryKey().notNull(),
	type: text("type").notNull(),
	title: text("title").notNull(),
	uploaderId: text("uploaderId")
		.notNull()
		.references(() => users.id),
	...timestamps,
});

export const dailyReports = sqliteTable("dailyReports", {
	id: integer("id").primaryKey().notNull(),
	reportId: integer("reportId")
		.notNull()
		.references(() => reports.id),
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
});

export const monthlyReports = sqliteTable("monthlyReports", {
	id: integer("id").primaryKey().notNull(),
	reportId: integer("reportId")
		.notNull()
		.references(() => reports.id),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
});

export const annualReports = sqliteTable("annualReports", {
	id: integer("id").primaryKey().notNull(),
	reportId: integer("reportId")
		.notNull()
		.references(() => reports.id),
	year: integer("year").notNull(),
});
