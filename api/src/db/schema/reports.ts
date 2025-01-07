import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { timestamps } from "../columnHelper";

export const reports = sqliteTable("reports", {
	id: integer("id").primaryKey().notNull(),
	type: text("type").notNull(),
	title: text("title").notNull(),
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	uploaderId: text("uploaderId")
		.notNull()
		.references(() => users.id),
	...timestamps,
});
