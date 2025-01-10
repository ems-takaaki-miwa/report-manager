import type * as z from "zod";
import { hono } from "~/lib/hono";
import { handleError } from "~/lib/utils";
import { getStorageUser } from "~/lib/utils";
import type { Report } from "~/types/report";
import type { FormActionProps, ReportType } from "~/types/report";

type DownloadProps = {
	report: Report;
};

type FetchReportsProps = {
	type: ReportType;
	year: number;
	month: number;
};
// レポート
export const fetchReports = async ({
	type,
	year,
	month,
}: FetchReportsProps): Promise<Report[]> => {
	const user = await getStorageUser();
	if (!user) {
		throw new Error("ログインしていません");
	}

	const response = await hono.api.reports.reports.$post(
		{
			json: {
				type,
				year,
				month,
			},
		},
		{
			headers: {
				"Session-Id": user.sessionId,
			},
		},
	);
	if (!response.ok) {
		handleError(response.status as number);
	}
	const data = await response.json();
	return data.reports.sort((a, b) => b.day - a.day) as Report[];
};

// レポートアップロード
export const uploadReport = async (props: FormActionProps) => {
	const user = await getStorageUser();
	if (!user) {
		throw new Error("ログインしていません");
	}
	const response = await hono.api.reports.create.$post(
		{
			json: {
				title: props.report.title,
				day: props.report.day,
				month: props.report.month,
				year: props.report.year,
				type: props.report.type,
				uploaderId: user?.id || "",
			},
		},
		{
			headers: {
				"Session-Id": user.sessionId,
			},
		},
	);
	if (response.ok) {
		props.reset();
		const data = await response.json();

		return data.report as Report;
	}
	console.log("uploadReport error");
	handleError(response.status as number);
};

// レポート編集
export const editReport = async (props: FormActionProps) => {
	const user = await getStorageUser();
	if (!user) {
		throw new Error("ログインしていません");
	}

	const response = await hono.api.reports.update.$post(
		{
			json: {
				id: props.report.id,
				title: props.report.title,
				day: props.report.day,
				month: props.report.month,
				year: props.report.year,
				type: props.report.type,
				uploaderId: user?.id || "",
			},
		},
		{
			headers: {
				"Session-Id": user.sessionId,
			},
		},
	);
	if (response.ok) {
		// props.reset();
		const data = await response.json();
		return data.report as Report;
	}
	handleError(response.status as number);
};

// レポート削除
export const deleteReport = async (report: Report) => {
	const user = await getStorageUser();
	if (!user) {
		throw new Error("ログインしていません");
	}
	const response = await hono.api.reports.delete.$post(
		{
			json: {
				id: report.id,
			},
		},
		{
			headers: {
				"Session-Id": user.sessionId,
			},
		},
	);
	if (response.ok) {
		const data = await response.json();
		return data.report as Report;
	}
	const status: number = response.status;
	handleError(status);
};

// レポートダウンロード
export const downloadReport = async ({ report }: DownloadProps) => {
	const user = await getStorageUser();
	if (!user) {
		throw new Error("ログインしていません");
	}
	const response = await hono.api.reports.download.$post(
		{
			json: {
				id: report.id,
			},
		},
		{
			headers: {
				"Session-Id": user.sessionId,
			},
		},
	);
	if (!response.ok) {
		handleError(response.status as number);
	}
	const blob = await response.blob();
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${report.title}.pdf`; // 保存時のファイル名
	document.body.appendChild(a);

	// 自動的にリンクをクリックしてダウンロード
	a.click();

	// リンクを削除
	document.body.removeChild(a);

	// Blob URL を解放
	window.URL.revokeObjectURL(url);
};
