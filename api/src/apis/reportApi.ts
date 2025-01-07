import { Hono } from "hono";
import { Bindings } from "../bindings";
import * as model from "../models/reportModel";
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
	.get("/daily-reports", async (c) => {
		const reports = await model.getReports(c.env.DB, "daily");
		return c.json({ reports: reports, ok: true });
	})

	.get("/monthly-reports", async (c) => {
		const reports = await model.getReports(c.env.DB, "monthly");
		return c.json({ reports: reports, ok: true });
	})

	.get("/annual-reports", async (c) => {
		const reports = await model.getReports(c.env.DB, "annual");
		return c.json({ reports: reports, ok: true });
	})

	// ファイル作成
	.post("/", zValidator("json", model.reportInsertSchema), async (c) => {
		const param = c.req.valid("json");
		const newFile = await model.createReport(c.env.DB, param);
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
			const deleteFile = await model.deleteReport(c.env.DB, param.id);
			if (!deleteFile) {
				return c.json({ error: "Can not delete the file", ok: false }, 422);
			}
			return c.json({ post: deleteFile, ok: true }, 201);
		},
	);

export default api;
