import { and, eq, gte, lt, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { users } from "../db/schema/users";

export const userSelectSchema = createSelectSchema(users);
export type User = z.infer<typeof userSelectSchema>;
export const userInsertSchema = createInsertSchema(users).omit({
	hashedPassword: true,
	createdAt: true,
	updatedAt: true,
});

const getHashedPassword = async (password: string): Promise<string> => {
	return await crypto.subtle
		.digest("SHA-256", new TextEncoder().encode(password))
		.then((hash) => {
			return Array.from(new Uint8Array(hash))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
		});
};

// ユーザー登録
export const createUser = async (
	D1: D1Database,
	userId: string,
	name: string,
	role: "admin" | "user",
	password: string,
): Promise<boolean> => {
	const db = drizzle(D1);
	const hashedPassword: string = await getHashedPassword(password);

	try {
		// ユーザーを作成
		// Todo: createdAt, updatedAtを追加
		await db.insert(users).values({
			id: userId,
			name: name,
			role: role,
			hashedPassword: hashedPassword,
		});

		return true;
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
};

// ログイン時の取得
export const getUserByCredentials = async (
	D1: D1Database,
	userId: string,
	password: string,
): Promise<User | null> => {
	const db = drizzle(D1);

	const hashedPassword: string = await getHashedPassword(password);

	try {
		// データベースからユーザーを取得
		// Todo: hashedPasswordをは返却しない
		const user = await db
			.select()
			.from(users)
			.where(
				and(eq(users.id, userId), eq(users.hashedPassword, hashedPassword)),
			)
			.limit(1);

		// ユーザーが存在しない場合はnullを返す
		if (!user) {
			return null;
		}
		return userSelectSchema.parse(user[0]);
	} catch (error) {
		console.error("Error retrieving user:", error);
		throw error;
	}
};
