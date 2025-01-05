import ReportTable, { type DailyReport } from "../components/reportTable";

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
	{
		id: "3",
		year: 2024,
		month: 2,
		day: 28,
		title: "2024年2月28日 日報",
		updatedAt: "2024/02/28",
	},
	{
		id: "4",
		year: 2024,
		month: 2,
		day: 27,
		title: "2024年2月27日 日報",
		updatedAt: "2024/02/27",
	},
];

const DailyReports: React.FC = () => {
	const groupedReports = sampleReports.reduce(
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

	return (
		<div className="p-4">
			<div className="overflow-x-auto">
				{Object.entries(groupedReports).map(([yearMonth, reports]) => {
					const [year, month] = yearMonth.split("-");
					return (
						<div key={yearMonth} className="mb-8">
							<div className="divider text-xl font-semibold">
								{`${year}年${month}月`}
							</div>
							<ReportTable reports={reports} type="daily" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DailyReports;
