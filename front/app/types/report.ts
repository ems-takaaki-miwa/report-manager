import type { UseFormReset } from "react-hook-form";

export type Report = {
	id: number;
	type: ReportType;
	year: number;
	month: number;
	day: number;
	title: string;
	uploaderId: string;
	updatedAt: string | null;
	createdAt: string | null;
};

export type ReportType = "daily" | "monthly" | "annual";

export const FetchReportsQueryKey = {
	DAILY: "daily",
	MONTHLY: "monthly",
	ANNUAL: "annual",
} as const;

export type FormActionProps = {
	report: Report;
	reset: UseFormReset<{
		type: "daily" | "monthly" | "annual";
		title: string;
		year: number;
		month: number;
		day: number;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		file?: any;
	}>;
};
