import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Bindings } from "../bindings";
import { checkSession } from "../middlewares/authMiddleware";
import * as model from "../models/reportModel";

const GetReportsParam = z.object({
	type: z.enum(["daily", "monthly", "annual"]),
	year: z.coerce.number(),
	month: z.coerce.number(),
});

export type GetReportProps = z.infer<typeof GetReportsParam>;

const api = new Hono<{ Bindings: Bindings }>()
	// このルートのミドルウェア
	.use("/*", async (c, next) => {
		return checkSession(c, next);
	})

	// レポート取得
	.post("/reports", zValidator("json", GetReportsParam), async (c) => {
		const param: GetReportProps = c.req.valid("json");
		const reports = await model.getReports(c.env.DB, param);
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
	)

	// レポートダウンロード
	.post(
		"/download",
		zValidator(
			"json",
			z.object({
				id: z.number(),
			}),
		),
		async (c) => {
			const param = c.req.valid("json");
			const report = await model.getReportById(c.env.DB, param.id);

			if (!report) {
				return c.json({ error: "Report not found", ok: false }, 404);
			}

			// Todo: R2に保存したPDFを取得するようにする
			const file = await fetch("http://127.0.0.1:8787/static/test.pdf");
			return new Response(file.body, {
				headers: {
					"Content-Type": "application/pdf",
				},
			});
		},
	);

export default api;
