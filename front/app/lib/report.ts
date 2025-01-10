import type * as z from "zod";
import { hono } from "~/lib/hono";
import { handleError } from "~/lib/utils";
import { getStorageUser } from "~/lib/utils";
import type { Report } from "~/types/report";

type DownloadProps = {
	report: Report;
};

export const downloadReport = async ({ report }: DownloadProps) => {
	const user = getStorageUser();
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
