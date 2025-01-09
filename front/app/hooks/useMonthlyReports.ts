import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { currentPageAtom } from "~/atoms";
import { hono } from "~/lib/hono";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import { GetReportsQueryKey, type Report } from "~/types/report";

export const useMonthlyReports = () => {
	const navigate = useNavigate();
	const user = getStorageUser();
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

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
			setCurrentPage({
				reportType: "monthly",
				year,
			});
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
		[navigate, user, setCurrentPage],
	);

	const { data, error, isLoading, isError } = useQuery({
		queryKey: [GetReportsQueryKey.MONTHLY, selectedYear],
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
