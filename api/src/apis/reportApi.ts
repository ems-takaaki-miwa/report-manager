import { Hono } from "hono";
import { Bindings } from "../bindings";
import * as model from "../models/reportModel";
import { checkSession } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const DailyReportsParam = z.object({
	month: z.coerce.number(),
	year: z.coerce.number(),
});

const MonthlyReportsParam = z.object({
	year: z.coerce.number(),
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

	// 日報取得
	.get("/daily-reports", zValidator("json", DailyReportsParam), async (c) => {
		const param = c.req.valid("json");
		const reports = await model.getDailyReportsByYearMonth(
			c.env.DB,
			param.year,
			param.month,
		);
		return c.json({ reports: reports, ok: true });
	})

	// 月報取得
	.get(
		"/monthly-reports",
		zValidator("json", MonthlyReportsParam),
		async (c) => {
			const param = c.req.valid("json");
			const reports = await model.getMonthlyReportsByYear(c.env.DB, param.year);
			return c.json({ reports: reports, ok: true });
		},
	)

	// 年報取得
	.get("/annual-reports", async (c) => {
		const reports = await model.getAnnualReports(c.env.DB);
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

	// ファイル削除
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
