import type { User } from "./userModel";
export interface Session {
	user: User;
	expires: number;
}

export const COOKIE_NAME = "sessionId";

export const setSessionToKV = async (
	KV: KVNamespace,
	sessionId: string,
	expires: number,
	user: User,
): Promise<void> => {
	const session: Session = {
		user: user,
		expires: expires,
	};
	await KV.put(sessionId, JSON.stringify(session));
};
