import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { Bindings } from "../bindings";
import * as userModel from "../models/userModel";
import * as sessionModel from "../models/sessionModel";
import { checkSession } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const api = new Hono<{ Bindings: Bindings }>();

// ログインAPIエンドポイント
api.post(
	"/login",
	zValidator(
		"json",
		z.object({
			userId: z.string(),
			password: z.string(),
		}),
	),
	async (c) => {
		const param = c.req.valid("json");
		try {
			// ユーザーを取得
			const user = await userModel.getUserByCredentials(
				c.env.DB,
				param.userId,
				param.password,
			);

			if (!user) {
				return c.json({ error: "Invalid username or password" }, 401);
			}

			// セッションIDを生成
			const sessionId = crypto.randomUUID();
			// セッションIDをCookieに保存
			const maxAge = 60 * 60 * 24; // 1日
			const now = Date.now();
			const oneDayLater = now + maxAge; // 1日後
			setCookie(c, sessionModel.COOKIE_NAME, sessionId, {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				maxAge: maxAge,
			});
			// セッションIDをKVに保存
			await sessionModel.setSessionToKV(
				c.env.MY_KV,
				sessionId,
				oneDayLater,
				user,
			);

			// ユーザーが取得できた場合、ログイン成功
			return c.json({ message: "Login successful", user });
		} catch (error) {
			console.error("Error during login:", error);
			return c.json({ error: "An error occurred during login" }, 500);
		}
	},
);

// ユーザー登録APIエンドポイント
api.post(
	"/register",
	zValidator(
		"json",
		z.object({
			userId: z.string(),
			name: z.string(),
			password: z.string(),
		}),
	),
	async (c) => {
		const param: userModel.RegisterParam = c.req.valid("json");

		try {
			// ユーザーを作成
			const user = await userModel.createUser(
				c.env.DB,
				param.userId,
				param.name,
				param.password,
			);

			return c.json({ message: "User created", user });
		} catch (error) {
			console.error("Error during registration:", error);
			return c.json({ error: "An error occurred during registration" }, 500);
		}
	},
);

api.post("/logout", checkSession, async (c) => {
	try {
		deleteCookie(c, sessionModel.COOKIE_NAME);
		return c.json({ message: "Logout successful" });
	} catch (e) {
		return c.json({ error: "An error occurred during logout" }, 500);
	}
});

export default api;