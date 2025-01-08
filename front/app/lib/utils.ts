import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User } from "~/atoms";

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
