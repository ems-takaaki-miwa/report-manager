import { PrismaClient, User, File } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Context } from "hono";
import { Bindings } from "../bindings";
import { getCookie } from "hono/cookie";
import * as sessionModel from "./sessionModel";

export type Param = {
	name: string; // ファイル名
	size: number; // ファイルのサイズ
	path: string; // ファイルの保存パス
};

export const getFiles = async (D1: D1Database): Promise<File[]> => {
	const adapter = new PrismaD1(D1);
	const prisma = new PrismaClient({ adapter });
	return await prisma.file.findMany();
};

export const createPost = async (
	c: Context<{ Bindings: Bindings }>,
	param: Param,
): Promise<File | null> => {
	// セッションIDを取得
	const sessionId = getCookie(c, sessionModel.COOKIE_NAME);
	// セッションIDがない場合はnullを返す(sessionCheckであることを知っているため、ほんとは不要)
	if (sessionId == null) {
		return null;
	}
	// セッションIDからKVからユーザーを取得
	const sessionData = await c.env.MY_KV.get(sessionId);
	if (!sessionData) {
		return null;
	}
	const user: User = JSON.parse(sessionData).user;
	console.log(user);

	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	try {
		return await prisma.file.create({
			data: {
				name: param.name,
				size: param.size,
				userId: user.userId,
				path: param.path,
			},
		});
	} catch (e) {
		console.error("Error creating file:", e);
		return null;
	}
};

// ファイル削除
export const deletePost = async (D1: D1Database, id: number): Promise<File | null> => {
	const adapter = new PrismaD1(D1);
	const prisma = new PrismaClient({ adapter });
	try {
		return await prisma.file.delete({
			where: {
				id: id,
			},
		});
	
	} catch (e) {
		console.error("Error deleting file:", e);
		return null;
	}
};