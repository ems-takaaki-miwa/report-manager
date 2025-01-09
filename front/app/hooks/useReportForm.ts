import { useState } from "react";

export const useReportForm = () => {
	const [reportType, setReportType] = useState<string>("daily");
	const [inputTitle, setInputTitle] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1,
	);

	return {
		reportType,
		setReportType,
		inputTitle,
		setInputTitle,
		selectedYear,
		setSelectedYear,
		selectedMonth,
		setSelectedMonth,
	};
};
