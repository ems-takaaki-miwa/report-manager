import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { currentPageAtom } from "~/atoms";
import { hono } from "~/lib/hono";
import { fetchReports } from "~/lib/report";
import { getStorageUser, removeStorageUser } from "~/lib/utils";
import { FetchReportsQueryKey, type Report } from "~/types/report";

export const useMonthlyReports = () => {
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
	const type = "monthly";

	const { data, error, isLoading, isError } = useQuery({
		queryKey: [FetchReportsQueryKey.MONTHLY, selectedYear],
		queryFn: () =>
			fetchReports({
				type: FetchReportsQueryKey.MONTHLY,
				year: selectedYear,
				month: 0,
			}),
	});

	const handlePrevYear = useCallback(async () => {
		setSelectedYear(selectedYear - 1);
		setCurrentPage({
			reportType: FetchReportsQueryKey.MONTHLY,
			year: selectedYear - 1,
			month: 0,
		});
	}, [selectedYear, setCurrentPage]);

	const handleNextYear = useCallback(async () => {
		setSelectedYear(selectedYear + 1);
		setCurrentPage({
			reportType: FetchReportsQueryKey.MONTHLY,
			year: selectedYear + 1,
			month: 0,
		});
	}, [selectedYear, setCurrentPage]);

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
