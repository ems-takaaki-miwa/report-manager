import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	name: string;
}

export interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
	removeUser: () => void;
}

export const useUserStore = create(
	persist<UserStore>(
		(set) => ({
			user: null,
			setUser: (user: User) => set({ user: user }),
			removeUser: () => set({ user: null }),
		}),
		{
			name: "user",
		},
	),
);
