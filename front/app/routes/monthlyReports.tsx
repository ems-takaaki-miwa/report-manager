import { useMonthlyReports } from "~/hooks/useMonthlyReports";
import ReportTable from "../components/reportTable";
import type { Route } from "./+types/monthlyReports";

const MonthlyReports: React.FC<Route.ComponentProps> = () => {
	const {
		data,
		selectedYear,
		isLoading,
		isError,
		error,
		handlePrevYear,
		handleNextYear,
	} = useMonthlyReports();

	return (
		<div className="p-4">
			<div className="w-full">
				<div className="mb-8 flex flex-col gap-4">
					<div className="divider text-xl font-semibold">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handlePrevYear}
							disabled={isLoading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<title>前の年</title>
								<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
							</svg>
						</button>
						{selectedYear}年
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handleNextYear}
							disabled={isLoading}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="36px"
								viewBox="0 -960 960 960"
								width="36px"
								fill="#5f6368"
							>
								<title>次の年</title>
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
						<ReportTable reports={data ?? []} type="monthly" />
					)}
				</div>
			</div>
		</div>
	);
};

export default MonthlyReports;
