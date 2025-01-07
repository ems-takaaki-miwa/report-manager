import ReportTable, { type DailyReport } from "../components/reportTable";
import type { Route } from "./+types/dailyReports";
import { useState } from "react";

const sampleReports: DailyReport[] = [
	{
		id: "1",
		year: 2024,
		month: 3,
		day: 15,
		title: "2024年3月15日 日報",
		updatedAt: "2024/03/15",
	},
	{
		id: "2",
		year: 2024,
		month: 3,
		day: 14,
		title: "2024年3月14日 日報",
		updatedAt: "2024/03/14",
	},
];

export async function clientLoader() {
	// 今月のデータを取得する
	return sampleReports;
}

const reportFormat = (
	reports: DailyReport[],
): Record<string, DailyReport[]> => {
	return reports.reduce(
		(acc, report) => {
			const key = `${report.year}-${report.month}`;
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(report);
			return acc;
		},
		{} as Record<string, DailyReport[]>,
	);
};

const DailyReports: React.FC<Route.ComponentProps> = ({ loaderData }) => {
	const [reports, setReports] = useState<DailyReport[]>(loaderData);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1,
	);

	const handleArrowClick = (direction: "prev" | "next") => {
		// 年月を更新する
		if (direction === "prev") {
			if (selectedMonth === 1) {
				setSelectedMonth(12);
				setSelectedYear(selectedYear - 1);
			} else {
				setSelectedMonth(selectedMonth - 1);
			}
		} else {
			if (selectedMonth === 12) {
				setSelectedMonth(1);
				setSelectedYear(selectedYear + 1);
			} else {
				setSelectedMonth(selectedMonth + 1);
			}
		}
		// データを更新する
	};

	return (
		<div className="p-4">
			<div className="w-full">
				<div className="mb-8 flex flex-col gap-4">
					<div className="divider text-xl font-semibold">
						<button
							className="btn btn-ghost"
							onClick={() => handleArrowClick("prev")}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
							</svg>
						</button>
						{`${selectedYear}年${selectedMonth}月`}
						<button
							className="btn btn-ghost"
							onClick={() => handleArrowClick("next")}
							disabled={true}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
							</svg>
						</button>
					</div>
					<ReportTable reports={reports} type="daily" />
				</div>
			</div>
		</div>
	);
};

export default DailyReports;
