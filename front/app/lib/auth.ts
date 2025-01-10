import type * as z from "zod";
import { hono } from "~/lib/hono";
import { handleError } from "~/lib/utils";
import { getStorageUser } from "~/lib/utils";
import type { signUpSchema } from "~/validations/userShema";

export type SinUpProps = z.infer<typeof signUpSchema>;

export const signUp = async ({ userId, password, role, name }: SinUpProps) => {
	const user = getStorageUser();
	const response = await hono.api.auth.register.$post(
		{
			json: {
				id: userId,
				password: password,
				role: role,
				name: name,
			},
		},
		{
			headers: {
				"Session-Id": user?.sessionId || "", // レイアウト部分であることは確認済みなので、ほんとはチェック不要
			},
		},
	);

	if (response.ok) {
		const data = await response.json();
		return data.message;
	}
	handleError(response.status as number);
};
