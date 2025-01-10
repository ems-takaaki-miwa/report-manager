import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Report, ReportType } from "./types/report";
import type { Toast } from "./types/toast";
import type { User } from "./types/user";

export interface CurrentPage {
	reportType: ReportType;
	year: number;
	month: number;
}

export const userAtom = atomWithStorage<User | null>("user", null);
export const reportAtom = atom<Report | null>(null);
export const currentPageAtom = atom<CurrentPage | null>(null);
export const toastAtom = atom<Toast>({
	isOpen: false,
	message: "",
	variant: "success",
});
