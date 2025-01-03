import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Bindings } from "../bindings";
import { getCookie } from "hono/cookie";
import * as sessionModel from "./sessionModel";
import { files } from "../db/schema/files";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { eq, lte, gte, and } from "drizzle-orm";
import { User } from "./userModel";

const fileSelectSchema = createSelectSchema(files);
// スキーマから型を生成
type File = z.infer<typeof fileSelectSchema>;

// ファイル取得
export const getFiles = async (
	D1: D1Database,
	from: Date,
	to: Date,
): Promise<File[]> => {
	const db = drizzle(D1);
	// Todo: タイムゾーンの変換が必要
	return await db
		.select()
		.from(files)
		.where(and(gte(files.fileDate, from), lte(files.fileDate, to)));
	// return fileSelectSchema.parse(result);
};

// ファイル作成
export const createFile = async (
	c: Context<{ Bindings: Bindings }>,
	name: string,
	fileDate: Date,
): Promise<boolean | null> => {
	// セッションIDを取得
	const sessionId = getCookie(c, sessionModel.COOKIE_NAME);
	// セッションIDがない場合はnullを返す(sessionCheckであることを知っているため、ほんとは不要)
	if (sessionId == null) {
		return null;
	}
	// セッションからユーザーを取得
	const sessionData = await c.env.MY_KV.get(sessionId);
	if (!sessionData) {
		return null;
	}
	const user: User = JSON.parse(sessionData).user;
	const db = drizzle(c.env.DB);
	const now = new Date().getTime();
	try {
		await db.insert(files).values({
			name: name,
			fileDate: fileDate,
			uploaderId: user.id,
			createdAt: new Date(now),
			updatedAt: new Date(now),
		});
		return true;
	} catch (e) {
		console.error("Error creating file:", e);
		return null;
	}
};

// ファイル削除
export const deletePost = async (
	D1: D1Database,
	id: number,
): Promise<boolean> => {
	const db = drizzle(D1);

	try {
		await db.delete(files).where(eq(files.id, id));
		return true;
	} catch (e) {
		console.error("Error deleting file:", e);
		return false;
	}
};
