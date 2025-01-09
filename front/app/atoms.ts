import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Report } from "./types/report";

export interface User {
	id: string;
	name: string;
	role: "admin" | "user";
	sessionId: string;
}

export const userAtom = atomWithStorage<User | null>("user", null);
export const reportAtom = atom<Report | null>(null);
