import { redirect, data } from "react-router";
import ReportTable, { type Report } from "../components/reportTable";
import type { Route } from "./+types/monthlyReports";
import { useMonthlyReports } from "~/hooks/useMonthlyReports";
import { formatYearMonth, getCurrentYearMonth } from "../lib/utils/dateUtils";
import { getMonthlyReports } from "../lib/api/reportApi";

export async function clientLoader() {
	const reports = await getMonthlyReports(new Date().getFullYear());

	if (reports === 401) {
		localStorage.removeItem("user");
		return redirect("/login");
	}

	if (reports === 500) {
		console.error("サーバーエラー");
		throw data("サーバー側でエラーが起きました。", { status: 500 });
	}

	return reports as Report[];
}

const MonthlyReports: React.FC<Route.ComponentProps> = ({ loaderData }) => {
	const {
		reports,
		selectedYear,
		isLoading,
		error,
		handlePrevMonth,
		handleNextMonth,
	} = useMonthlyReports(loaderData);

	if (error) {
		return <div className="text-red-500 p-4">{error}</div>;
	}

	return (
		<div className="p-4">
			<div className="w-full">
				<div className="mb-8 flex flex-col gap-4">
					<div className="divider text-xl font-semibold">
						<button
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
								<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
							</svg>
						</button>
						{selectedYear}年
						<button
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
								<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
							</svg>
						</button>
					</div>
					{isLoading ? (
						<div className="flex w-full flex-col gap-4">
							<div className="skeleton h-4 w-full"></div>
							<div className="skeleton h-72 w-full"></div>
						</div>
					) : (
						<ReportTable reports={reports} type="monthly" />
					)}
				</div>
			</div>
		</div>
	);
};

export default MonthlyReports;
