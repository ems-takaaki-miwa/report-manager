import { atomWithStorage } from "jotai/utils";

interface User {
	id: string;
	name: string;
	sessionId: string;
}

export const userAtom = atomWithStorage<User | null>("user", null);
