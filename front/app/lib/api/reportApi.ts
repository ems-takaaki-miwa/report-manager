import { hono } from "~/lib/hono";
import { type User } from "~/atoms";
import { type Report } from "../../components/reportTable";

export const getDailyReports = async (
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

export const getMonthlyReports = async (
	year: number,
): Promise<Report[] | number> => {
	const user = JSON.parse(localStorage.getItem("user") || "null") as User;
	const response = await hono.api.reports["monthly-reports"].$post(
		{
			json: {
				year,
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

export const getAnnualReports = async (): Promise<Report[] | number> => {
	const user = JSON.parse(localStorage.getItem("user") || "null") as User;
	const response = await hono.api.reports["annual-reports"].$post(
		{
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

export const createReports = async (
	year: number,
	month: number,
	day: number,
	title: string,
	type: "daily" | "monthly" | "annual"
): Promise<Report[] | number> => {
	const user = JSON.parse(localStorage.getItem("user") || "null") as User;
	const response = await hono.api.reports.index.$post(
		{
			json: {
				year,
				month,
				day,
				title,
				uploaderId: user?.id || "",
				type,
			},
		},
		{
			headers: {
				"Session-Id": user?.sessionId || "",
			},
		},
	);

	if (response.status === 422) {
		console.error("アップロード失敗");
		return 422;
	}


	if (response.status === 401) {
		localStorage.removeItem("user");
		return 401;
	}

	if (response.status === 500) {
		console.error("サーバーエラー");
		return 500;
	}

	if (response.status === 201) {
		localStorage.removeItem("user");
		return 201;
	}

	const data = await response.json();
	return data.reports;
};



