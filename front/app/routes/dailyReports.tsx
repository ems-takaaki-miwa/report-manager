import ReportTable from "../components/reportTable";
import { useDailyReports } from "../hooks/useDailyReports";
import { formatYearMonth } from "../lib/utils/dateUtils";
import type { Route } from "./+types/dailyReports";

const DailyReports: React.FC<Route.ComponentProps> = () => {
	const {
		data,
		selectedYear,
		selectedMonth,
		isLoading,
		isError,
		error,
		handlePrevMonth,
		handleNextMonth,
	} = useDailyReports();

	return (
		<div className="p-4">
			<div className="w-full">
				<div className="mb-8 flex flex-col gap-4">
					<div className="divider text-xl font-semibold">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handlePrevMonth}
							disabled={isLoading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<title>前の月</title>
								<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
							</svg>
						</button>
						{formatYearMonth(selectedYear, selectedMonth)}
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handleNextMonth}
							disabled={isLoading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<title>次の月</title>
								<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
							</svg>
						</button>
					</div>
					{isLoading ? (
						<div className="flex w-full flex-col gap-4">
							<div className="skeleton h-4 w-full" />
							<div className="skeleton h-72 w-full" />
						</div>
					) : isError ? (
						<div className="text-red-500 p-4">{error?.message}</div>
					) : (
						<ReportTable reports={data ?? []} type="daily" />
					)}
				</div>
			</div>
		</div>
	);
};

export default DailyReports;
