// columns.helpers.ts
import { integer } from "drizzle-orm/sqlite-core";
export const timestamps = {
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }),
};
