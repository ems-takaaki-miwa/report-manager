import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../columnHelper";

export const users = sqliteTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	role: text("role", { enum: ["admin", "user"] }).notNull(),
	hashedPassword: text("hashedPassword").notNull(),
	...timestamps,
});
