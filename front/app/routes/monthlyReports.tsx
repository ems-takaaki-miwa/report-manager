import React from "react";
import ReportTable, { type MonthlyReport } from "../components/reportTable";

const sampleReports: MonthlyReport[] = [
	{
		id: "1",
		year: 2024,
		month: 3,
		title: "2024年3月度 月次報告",
		updatedAt: "2024/03/31",
	},
	{
		id: "2",
		year: 2024,
		month: 2,
		title: "2024年2月度 月次報告",
		updatedAt: "2024/02/29",
	},
	{
		id: "3",
		year: 2024,
		month: 1,
		title: "2024年1月度 月次報告",
		updatedAt: "2024/01/31",
	},
	{
		id: "4",
		year: 2023,
		month: 12,
		title: "2023年12月度 月次報告",
		updatedAt: "2023/12/31",
	},
	{
		id: "5",
		year: 2023,
		month: 11,
		title: "2023年11月度 月次報告",
		updatedAt: "2023/11/30",
	},
];

const MonthlyReports: React.FC = () => {
	// 年度ごとにレポートをグループ化
	const reportsByYear = sampleReports.reduce(
		(acc, report) => {
			const year = report.year;
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(report);
			return acc;
		},
		{} as Record<number, MonthlyReport[]>,
	);

	// 年度の降順でソート
	const years = Object.keys(reportsByYear)
		.map(Number)
		.sort((a, b) => b - a);

	return (
		<div className="p-4">
			{years.map((year) => (
				<div key={year}>
					<div className="divider text-xl font-semibold">{year}年度</div>
					<ReportTable reports={reportsByYear[year]} type="monthly" />
				</div>
			))}
		</div>
	);
};

export default MonthlyReports;
