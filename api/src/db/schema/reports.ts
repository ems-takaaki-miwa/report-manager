import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../columnHelper";
import { users } from "./users";

export const reports = sqliteTable("reports", {
	id: integer("id").primaryKey().notNull(),
	type: text("type", { enum: ["daily", "monthly", "annual"] }).notNull(),
	title: text("title").notNull(),
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	uploaderId: text("uploaderId")
		.notNull()
		.references(() => users.id),
	...timestamps,
});
