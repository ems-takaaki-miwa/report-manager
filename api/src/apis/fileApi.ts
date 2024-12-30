import { Hono } from "hono";
import { Bindings } from "../bindings";
import * as model from "../models/fileModel";
import { checkSession } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const api = new Hono<{ Bindings: Bindings }>();

api.use("/*", async (c, next) => {
	return checkSession(c, next);
});

api.get("/", async (c) => {
	const files = await model.getFiles(c.env.DB);
	console.log(files);
	return c.json({ files: files, ok: true });
});

api.post(
	"/",
	zValidator(
		"json",
		z.object({
			name: z.string(),
			size: z.number(),
			path: z.string(),
		}),
	),
	async (c) => {
		const param = c.req.valid("json");
		const newFile = await model.createPost(c, param as model.Param);
		if (!newFile) {
			return c.json({ error: "Can not create new file", ok: false }, 422);
		}
		return c.json({ post: newFile, ok: true }, 201);
	},
);

api.delete(
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
