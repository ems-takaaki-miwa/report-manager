import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { hono } from "~/lib/hono";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import type { Report } from "../components/reportTable";

export const useAnnualReports = () => {
	const navigate = useNavigate();
	const user = getStorageUser();

	const fetchReports = useCallback(async () => {
		const response = await hono.api.reports["annual-reports"].$post(
			{},
			{
				headers: {
					"Session-Id": user?.sessionId || "", // レイアウト部分であることは確認済みなので、ほんとはチェック不要
				},
			},
		);
		if (response.ok) {
			const data = await response.json();
			return data.reports as Report[];
		}
		switch (response.status) {
			case 401:
				removeStorageUser();
				navigate("/login");
				throw new Error("セッションの有効期限が切れました。");
			case 500:
				throw new Error("サーバーエラーが発生しました");
			default:
				throw new Error("不明なエラーが発生しました");
		}
	}, [navigate, user]);

	const { data, error, isLoading } = useQuery({
		queryKey: ["getAnnualReports"],
		queryFn: fetchReports,
	});

	return {
		data,
		isLoading,
		error,
	};
};
