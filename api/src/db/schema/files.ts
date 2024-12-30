import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { timestamps } from "../columnHelper";

export const files = sqliteTable("files", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
    fileDate: integer("fileDate", { mode: "timestamp" }),
	uploaderId: text("uploaderId")
		.notNull()
		.references(() => users.id),
	...timestamps,
});