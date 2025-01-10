import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import type { GetReportProps } from "../apis/reportApi";
import { reports } from "../db/schema/reports";

export const reportSelectSchema = createSelectSchema(reports);
export const reportInsertSchema = createSelectSchema(reports).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export const reportUpdateSchema = createSelectSchema(reports).omit({
	createdAt: true,
	updatedAt: true,
});
// スキーマから型を生成
type Report = z.infer<typeof reportSelectSchema>;
type ReportInsert = z.infer<typeof reportInsertSchema>;
type ReportUpdate = z.infer<typeof reportUpdateSchema>;

// レポート取得
export const getReports = async (
	D1: D1Database,
	param: GetReportProps,
): Promise<Report[]> => {
	const db = drizzle(D1);

	switch (param.type) {
		case "daily":
			return await getDailyReportsByYearMonth(D1, param.year, param.month);
		case "monthly":
			return await getMonthlyReportsByYear(D1, param.year);
		case "annual":
			return await getAnnualReports(D1);
		default:
			throw new Error("不明なパラメーターです");
	}
};

// 年月による日報検索メソッド
const getDailyReportsByYearMonth = async (
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
const getMonthlyReportsByYear = async (
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
const getAnnualReports = async (D1: D1Database): Promise<Report[]> => {
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

// レポート更新メソッド
export const updateReport = async (
	D1: D1Database,
	reportData: ReportUpdate,
): Promise<Report> => {
	const db = drizzle(D1);
	const now = new Date();

	const result = await db
		.update(reports)
		.set({
			type: reportData.type,
			title: reportData.title,
			year: reportData.year,
			month: reportData.month,
			day: reportData.day,
			updatedAt: now,
		})
		.where(eq(reports.id, reportData.id))
		.returning();
	return result[0];
};

// レポート削除メソッド
export const deleteReport = async (
	D1: D1Database,
	reportId: number,
): Promise<Report> => {
	const db = drizzle(D1);

	const result = await db
		.delete(reports)
		.where(eq(reports.id, reportId))
		.returning();

	return result[0];
};

export const getReportById = async (
	D1: D1Database,
	reportId: number,
): Promise<Report> => {
	const db = drizzle(D1);
	const result = await db
		.select()
		.from(reports)
		.where(eq(reports.id, reportId))
		.limit(1);
	return result[0];
};
