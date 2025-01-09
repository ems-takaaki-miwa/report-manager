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
