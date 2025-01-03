import { Hono } from "hono";
import { Bindings } from "../bindings";
import * as model from "../models/fileModel";
import { checkSession } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const FileGetParam = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});

export const FileCreateParam = z.object({
	name: z.string(),
	fileDate: z.coerce.date(),
});

const api = new Hono<{ Bindings: Bindings }>()
	// このルートのミドルウェア
	.use("/*", async (c, next) => {
		return checkSession(c, next);
	})

	// ファイル取得
	.get("/", zValidator("json", FileGetParam), async (c) => {
		console.log(new Date().toString());
		const param = c.req.valid("json");
		const files = await model.getFiles(c.env.DB, param.from, param.to);
		console.log(files);
		return c.json({ files: files, ok: true });
	})

	// ファイル作成
	.post("/", zValidator("json", FileCreateParam), async (c) => {
		const param = c.req.valid("json");
		const newFile = await model.createFile(c, param.name, param.fileDate);
		if (!newFile) {
			return c.json({ error: "Can not create new file", ok: false }, 422);
		}
		return c.json({ post: newFile, ok: true }, 201);
	})

	.delete(
		"/",
		zValidator(
			"json",
			z.object({
				id: z.number(),
			}),
		),
		async (c) => {
			const param = c.req.valid("json");
			const deleteFile = await model.deletePost(c.env.DB, param.id);
			if (!deleteFile) {
				return c.json({ error: "Can not delete the file", ok: false }, 422);
			}
			return c.json({ post: deleteFile, ok: true }, 201);
		},
	);

export default api;
