import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Bindings } from "../bindings";
import { checkSession } from "../middlewares/authMiddleware";
import * as model from "../models/reportModel";

const DailyReportsParam = z.object({
	month: z.coerce.number(),
	year: z.coerce.number(),
});

const MonthlyReportsParam = z.object({
	year: z.coerce.number(),
});

const api = new Hono<{ Bindings: Bindings }>()
	// このルートのミドルウェア
	.use("/*", async (c, next) => {
		return checkSession(c, next);
	})

	// 日報取得
	.post("/daily-reports", zValidator("json", DailyReportsParam), async (c) => {
		const param = c.req.valid("json");
		const reports = await model.getDailyReportsByYearMonth(
			c.env.DB,
			param.year,
			param.month,
		);
		return c.json({ reports: reports, ok: true });
	})

	// 月報取得
	.post(
		"/monthly-reports",
		zValidator("json", MonthlyReportsParam),
		async (c) => {
			const param = c.req.valid("json");
			const reports = await model.getMonthlyReportsByYear(c.env.DB, param.year);
			return c.json({ reports: reports, ok: true });
		},
	)

	// 年報取得
	.post("/annual-reports", async (c) => {
		const reports = await model.getAnnualReports(c.env.DB);
		return c.json({ reports: reports, ok: true });
	})

	// レポート作成
	.post("/create", zValidator("json", model.reportInsertSchema), async (c) => {
		const param = c.req.valid("json");
		const report = await model.createReport(c.env.DB, param);
		if (!report) {
			return c.json({ error: "Can not create new file", ok: false }, 422);
		}
		return c.json({ report, ok: true }, 201);
	})

	// レポート編集
	.post("/update", zValidator("json", model.reportUpdateSchema), async (c) => {
		const param = c.req.valid("json");
		const report = await model.updateReport(c.env.DB, param);
		if (!report) {
			return c.json({ error: "Can not update the file", ok: false }, 422);
		}
		return c.json({ report, ok: true }, 201);
	})

	// レポート削除
	.post(
		"/delete",
		zValidator(
			"json",
			z.object({
				id: z.number(),
			}),
		),
		async (c) => {
			const param = c.req.valid("json");
			const deleteReport = await model.deleteReport(c.env.DB, param.id);
			if (!deleteReport) {
				return c.json({ error: "Can not delete the file", ok: false }, 422);
			}
			return c.json({ report: deleteReport, ok: true }, 201);
		},
	);

export default api;
