import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { hono } from "~/lib/hono";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import type { Report } from "~/types/report";
import { useToast } from "./use-toast";

export const useEditReport = () => {
	const navigate = useNavigate();
	const user = getStorageUser();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const editReport = useCallback(
		async (report: Report) => {
			const response = await hono.api.reports.update.$post(
				{
					json: {
						id: report.id,
						title: report.title,
						day: report.day,
						month: report.month,
						year: report.year,
						type: report.type,
						uploaderId: user?.id || "",
					},
				},
				{
					headers: {
						"Session-Id": user?.sessionId || "", // レイアウト部分であることは確認済みなので、ほんとはチェック不要
					},
				},
			);
			if (response.ok) {
				const data = await response.json();
				toast({
					title: "success",
					description: "更新が完了しました",
					variant: "info",
				});
				return data.report as Report;
			}
			const status: number = response.status;
			switch (status) {
				case 400:
					throw new Error("パラメータに誤りがあります。");
				case 422:
					throw new Error("更新できませんでした。");
				case 401:
					removeStorageUser();
					navigate("/login");
					throw new Error("セッションの有効期限が切れました。");
				case 500:
					throw new Error("サーバーエラーが発生しました");
				default:
					throw new Error("不明なエラーが発生しました");
			}
		},
		[navigate, user, toast],
	);

	const { mutate, data, error, isPending } = useMutation({
		mutationFn: editReport,
	});

	return {
		mutate,
		data,
		isPending,
		error,
	};
};
