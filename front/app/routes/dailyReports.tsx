import { redirect, useNavigate, data } from "react-router";
import ReportTable, { type Report } from "../components/reportTable";
import type { Route } from "./+types/dailyReports";
import { useState } from "react";
import { hono } from "~/lib/hono";
import { type User } from "~/atoms";

const getDailyReport = async (
	month: number,
	year: number,
): Promise<Report[] | number> => {
	const user = JSON.parse(localStorage.getItem("user") || "null") as User;
	const response = await hono.api.reports["daily-reports"].$post(
		{
			json: {
				year: year,
				month: month,
			},
		},
		{
			headers: {
				"Session-Id": user?.sessionId || "",
			},
		},
	);
	if (response.status === 401) {
		localStorage.removeItem("user");
		return 401;
	}

	if (response.status === 500) {
		console.error("サーバーエラー");
		return 500;
	}
	const data = await response.json();
	return data.reports;
};

export async function clientLoader() {
	// 今月のデータを取得する
	const year = new Date().getFullYear();
	const month = new Date().getMonth() + 1;
	const reports = await getDailyReport(month, year);
	if (reports === 401) {
		// sessionIdを削除してログイン画面にリダイレクトする
		// jotaiのuserAtomを更新していないなから？レイアウトが更新されず、ヘッダーが表示されたままになる
		localStorage.removeItem("user");
		return redirect("/login");
	} else if (reports === 500) {
		console.error("サーバーエラー");
		throw data("サーバー側でエラーが起きました。", { status: 500 });
	}
	return reports as Report[];
}

const DailyReports: React.FC<Route.ComponentProps> = ({ loaderData }) => {
	const [reports, setReports] = useState<Report[]>(loaderData);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1,
	);
	const navigate = useNavigate();

	const handleArrowClick = async (direction: "prev" | "next") => {
		let newMonth = selectedMonth;
		let newYear = selectedYear;
		// 年月を更新する
		if (direction === "prev") {
			if (selectedMonth === 1) {
				newMonth = 12;
				newYear = selectedYear - 1;
			} else {
				newMonth = selectedMonth - 1;
			}
		} else {
			if (selectedMonth === 12) {
				newMonth = 1;
				newYear = selectedYear + 1;
			} else {
				newMonth = selectedMonth + 1;
			}
		}
		// データを更新する
		const reports = await getDailyReport(newMonth, newYear);
		if (reports === 401) {
			return navigate("/login");
		} else if (reports === 500) {
			console.error("サーバーエラー");
			alert("サーバーエラー");
			return;
		} else {
			// stateを更新
			setSelectedMonth(newMonth);
			setSelectedYear(newYear);
			setReports(reports as Report[]);
		}
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
