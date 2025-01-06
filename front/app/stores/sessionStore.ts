import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionStore {
	sessionId: string | null;
	setSessionId: (sessionId: string) => void;
	removeSessionId: () => void;
}

export const useSessionStore = create(
	persist<SessionStore>(
		(set) => ({
			sessionId: null,
			setSessionId: (sessionId: string) => set({ sessionId: sessionId }),
			removeSessionId: () => set({ sessionId: null }),
		}),
		{
			name: "sessionId",
		},
	),
);
