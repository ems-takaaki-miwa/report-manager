import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Report, ReportType } from "./types/report";

export interface User {
	id: string;
	name: string;
	role: "admin" | "user";
	sessionId: string;
}

export interface CurrentPage {
	reportType: ReportType;
	year?: number;
	month?: number;
}

export const userAtom = atomWithStorage<User | null>("user", null);
export const reportAtom = atom<Report | null>(null);
export const currentPageAtom = atom<CurrentPage | null>(null);
