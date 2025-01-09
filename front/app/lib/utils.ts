import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User } from "~/atoms";
import type { CurrentPage } from "~/atoms";
import { GetReportsQueryKey } from "~/types/report";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getStorageUser = (): User | null => {
	const userStr = localStorage.getItem("user");
	return userStr ? (JSON.parse(userStr) as User) : null;
};

export const removeStorageUser = () => {
	localStorage.removeItem("user");
};

export const GetQueryKey = (page: CurrentPage | null) => {
	if (!page) return [];
	switch (page.reportType) {
		case "annual":
			return [GetReportsQueryKey.ANNUAL];
		case "monthly":
			return [GetReportsQueryKey.MONTHLY, page.year];
		default:
			return [GetReportsQueryKey.DAILY, page.year, page.month];
	}
};

export const getReportTypeLabel = (type: string) => {
	switch (type) {
		case "daily":
			return "日報";
		case "monthly":
			return "月報";
		case "annual":
			return "年報";
		default:
			return type;
	}
};
