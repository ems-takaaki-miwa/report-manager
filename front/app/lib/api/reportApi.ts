import { hono } from "~/lib/hono";
import { type User } from "~/atoms";
import { type Report } from "../../components/reportTable";

export const getDailyReport = async (
	month: number,
	year: number,
): Promise<Report[] | number> => {
	const user = JSON.parse(localStorage.getItem("user") || "null") as User;
	const response = await hono.api.reports["daily-reports"].$post(
		{
			json: {
				year,
				month,
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
