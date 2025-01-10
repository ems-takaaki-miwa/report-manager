import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { currentPageAtom } from "~/atoms";
import { hono } from "~/lib/hono";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import { GetReportsQueryKey, type Report } from "~/types/report";
import {
	getCurrentYearMonth,
	getNextMonth,
	getPrevMonth,
} from "../lib/utils/dateUtils";

export const useDailyReports = () => {
	const navigate = useNavigate();
	const { year: currentYear, month: currentMonth } = getCurrentYearMonth();
	const user = getStorageUser();

	const [selectedYear, setSelectedYear] = useState<number>(currentYear);
	const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

	const fetchReports = useCallback(async (): Promise<Report[]> => {
		const response = await hono.api.reports["daily-reports"].$post(
			{
				json: {
					year: selectedYear,
					month: selectedMonth,
				},
			},
			{
				headers: {
					"Session-Id": user?.sessionId || "",
				},
			},
		);

		setCurrentPage({
			reportType: "daily",
			year: selectedYear,
			month: selectedMonth,
		});
		if (response.ok) {
			const data = await response.json();
			return data.reports.sort((a, b) => b.day - a.day) as Report[];
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
	}, [navigate, user, setCurrentPage, selectedYear, selectedMonth]);

	const { data, error, isLoading, isError } = useQuery({
		queryKey: [GetReportsQueryKey.DAILY, selectedYear, selectedMonth],
		queryFn: () => fetchReports(),
		gcTime: 0,
		staleTime: 0,
	});

	const handlePrevMonth = useCallback(async () => {
		const { year, month } = getPrevMonth(selectedYear, selectedMonth);
		setSelectedYear(year);
		setSelectedMonth(month);
	}, [selectedYear, selectedMonth]);

	const handleNextMonth = useCallback(async () => {
		const { year, month } = getNextMonth(selectedYear, selectedMonth);
		setSelectedYear(year);
		setSelectedMonth(month);
	}, [selectedYear, selectedMonth]);

	return {
		data,
		selectedYear,
		selectedMonth,
		isLoading,
		isError,
		error,
		handlePrevMonth,
		handleNextMonth,
	};
};
