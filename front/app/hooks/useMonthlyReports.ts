import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { getMonthlyReports } from "../lib/api/reportApi";
import { type Report } from "../components/reportTable";

export const useMonthlyReports = (initialData: Report[]) => {
	const navigate = useNavigate();
	const [reports, setReports] = useState<Report[]>(initialData);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchReports = useCallback(
		async (year: number) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getMonthlyReports(year);

				if (result === 401) {
					navigate("/login");
					return;
				}

				if (result === 500) {
					setError("サーバーエラーが発生しました");
					return;
				}

				setReports(result as Report[]);
				setSelectedYear(year);
			} catch (err) {
				setError("データの取得に失敗しました");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		},
		[selectedYear],
	);

	const handlePrevMonth = useCallback(async () => {
		await fetchReports(selectedYear - 1);
	}, [selectedYear]);

	const handleNextMonth = useCallback(async () => {
		await fetchReports(selectedYear + 1);
	}, [selectedYear]);

	return {
		reports,
		selectedYear,
		isLoading,
		error,
		handlePrevMonth,
		handleNextMonth,
	};
};
