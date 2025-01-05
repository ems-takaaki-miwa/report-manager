import React from "react";
import ReportTable, { type AnnualReport } from "../components/reportTable";

const sampleReports: AnnualReport[] = [
	{
		id: "1",
		year: 2023,
		title: "2023年度 年報報告",
		updatedAt: "2024/03/31",
	},
	{
		id: "2",
		year: 2022,
		title: "2022年度 年報報告",
		updatedAt: "2023/03/31",
	},
	{
		id: "3",
		year: 2021,
		title: "2021年度 年報報告",
		updatedAt: "2022/03/31",
	},
];

const columns = [
	{ key: "year", header: "年度" },
	{ key: "title", header: "タイトル" },
	{ key: "updatedAt", header: "更新日" },
];

const AnualReports: React.FC = () => {
	return (
		<div className="p-4">
			<ReportTable reports={sampleReports} type="annual" />
		</div>
	);
};

export default AnualReports;
