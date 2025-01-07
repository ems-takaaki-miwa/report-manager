import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { Bindings } from "../bindings";
import { getCookie } from "hono/cookie";
import * as sessionModel from "./sessionModel";
import { reports } from "../db/schema/reports";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { eq, lte, gte, and } from "drizzle-orm";
import { User } from "./userModel";

const reportSelectSchema = createSelectSchema(reports);
export const reportInsertSchema = createSelectSchema(reports).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
// スキーマから型を生成
type Report = z.infer<typeof reportSelectSchema>;
type ReportInsert = z.infer<typeof reportInsertSchema>;

type ReportType = "daily" | "monthly" | "annual";

// 年月による日報検索メソッド
export const getDailyReportsByYearMonth = async (
	D1: D1Database,
	year: number,
	month: number,
): Promise<Report[]> => {
	const db = drizzle(D1);

	return await db
		.select()
		.from(reports)
		.where(
			and(
				eq(reports.type, "daily"),
				eq(reports.year, year),
				eq(reports.month, month),
			),
		)
		.all();
};

// 年による月報検索メソッド
export const getMonthlyReportsByYear = async (
	D1: D1Database,
	year: number,
): Promise<Report[]> => {
	const db = drizzle(D1);

	return await db
		.select()
		.from(reports)
		.where(and(eq(reports.type, "monthly"), eq(reports.year, year)))
		.all();
};

// 年による年報検索メソッド
export const getAnnualReports = async (D1: D1Database): Promise<Report[]> => {
	const db = drizzle(D1);

	return await db
		.select()
		.from(reports)
		.where(eq(reports.type, "annual"))
		.all();
};

// レポート作成メソッド
export const createReport = async (
	D1: D1Database,
	reportData: ReportInsert,
): Promise<Report> => {
	const db = drizzle(D1);
	const now = new Date();

	const result = await db
		.insert(reports)
		.values({
			...reportData,
			updatedAt: now,
			createdAt: now,
		})
		.returning();

	return result[0];
};

// レポート削除メソッド
export const deleteReport = async (
	D1: D1Database,
	reportId: number,
): Promise<boolean> => {
	const db = drizzle(D1);

	const result = await db
		.delete(reports)
		.where(eq(reports.id, reportId))
		.returning();

	return result.length > 0;
};
