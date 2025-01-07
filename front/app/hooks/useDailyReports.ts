import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { getDailyReport } from "../lib/api/reportApi";
import { getCurrentYearMonth, getPrevMonth, getNextMonth } from "../lib/utils/dateUtils";
import { type Report } from "../components/reportTable";

export const useDailyReports = (initialData: Report[]) => {
  const navigate = useNavigate();
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth();

  const [reports, setReports] = useState<Report[]>(initialData);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDailyReport(month, year);

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
      setSelectedMonth(month);
    } catch (err) {
      setError("データの取得に失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handlePrevMonth = useCallback(async () => {
    const { year, month } = getPrevMonth(selectedYear, selectedMonth);
    await fetchReports(year, month);
  }, [selectedYear, selectedMonth, fetchReports]);

  const handleNextMonth = useCallback(async () => {
    const { year, month } = getNextMonth(selectedYear, selectedMonth);
    await fetchReports(year, month);
  }, [selectedYear, selectedMonth, fetchReports]);

  return {
    reports,
    selectedYear,
    selectedMonth,
    isLoading,
    error,
    handlePrevMonth,
    handleNextMonth,
  };
};
