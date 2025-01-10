import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { currentPageAtom } from "~/atoms";
import { fetchReports } from "~/lib/report";
import { FetchReportsQueryKey, type Report } from "~/types/report";
import {
	getCurrentYearMonth,
	getNextMonth,
	getPrevMonth,
} from "../lib/utils/dateUtils";

export const useDailyReports = () => {
	const { year: currentYear, month: currentMonth } = getCurrentYearMonth();

	const [selectedYear, setSelectedYear] = useState<number>(currentYear);
	const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

	const { data, error, isLoading, isError } = useQuery({
		queryKey: [FetchReportsQueryKey.DAILY, selectedYear, selectedMonth],
		queryFn: () =>
			fetchReports({
				type: FetchReportsQueryKey.DAILY,
				year: selectedYear,
				month: selectedMonth,
			}),
	});

	const handlePrevMonth = useCallback(async () => {
		const { year, month } = getPrevMonth(selectedYear, selectedMonth);
		setSelectedYear(year);
		setSelectedMonth(month);
		setCurrentPage({
			reportType: FetchReportsQueryKey.DAILY,
			year: year,
			month: month,
		});
	}, [selectedYear, selectedMonth, setCurrentPage]);

	const handleNextMonth = useCallback(async () => {
		const { year, month } = getNextMonth(selectedYear, selectedMonth);
		setSelectedYear(year);
		setSelectedMonth(month);
		setCurrentPage({
			reportType: FetchReportsQueryKey.DAILY,
			year: year,
			month: month,
		});
	}, [selectedYear, selectedMonth, setCurrentPage]);

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
