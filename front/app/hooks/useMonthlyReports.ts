import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { hono } from "~/lib/hono";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import type { Report } from "../components/reportTable";

export const useMonthlyReports = () => {
	const navigate = useNavigate();
	const user = getStorageUser();
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);

	const fetchReports = useCallback(
		async (year: number): Promise<Report[]> => {
			const response = await hono.api.reports["monthly-reports"].$post(
				{
					json: {
						year,
					},
				},
				{
					headers: {
						"Session-Id": user?.sessionId || "",
					},
				},
			);

			setSelectedYear(year);
			if (response.ok) {
				const data = await response.json();
				return data.reports.sort((a, b) => b.month - a.month) as Report[];
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
		},
		[navigate, user],
	);

	const { data, error, isLoading, isError } = useQuery({
		queryKey: ["getDailyReports", selectedYear],
		queryFn: () => fetchReports(selectedYear),
	});

	const handlePrevYear = useCallback(async () => {
		setSelectedYear(selectedYear - 1);
	}, [selectedYear]);

	const handleNextYear = useCallback(async () => {
		setSelectedYear(selectedYear + 1);
	}, [selectedYear]);

	return {
		data,
		selectedYear,
		isLoading,
		isError,
		error,
		handlePrevYear,
		handleNextYear,
	};
};
