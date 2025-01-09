import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Bindings } from "../bindings";
import { checkSession } from "../middlewares/authMiddleware";
import * as sessionModel from "../models/sessionModel";
import * as userModel from "../models/userModel";

const LoginParam = z.object({
	userId: z.string(),
	password: z.string(),
});

const RegisterParam = z.object({
	password: z.string(),
	...userModel.userInsertSchema.shape,
});

const api = new Hono<{ Bindings: Bindings }>()
	// ログインAPIエンドポイント
	.post("/login", zValidator("json", LoginParam), async (c) => {
		console.log(new Date());
		const param = c.req.valid("json");
		try {
			// Todo: ログイン済みの場合はエラーを返す

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
			const maxAge = 60 * 60 * 24 * 1000; // 1日。1000倍しているのはミリ秒に変換するため
			console.log("maxAge", maxAge);
			const now = Date.now();
			console.log(now);
			const oneDayLater = now + maxAge; // 1日後
			console.log("oneDayLater", oneDayLater);
			// セッションIDをKVに保存
			await sessionModel.setSessionToKV(
				c.env.MY_KV,
				sessionId,
				oneDayLater,
				user,
			);

			// ユーザーが取得できた場合、ログイン成功
			// 必要な情報のみにパースして返す
			const parsedUser: { id: string; name: string; role: "admin" | "user" } =
				userModel.userSelectSchema.parse(user);
			return c.json({
				message: "Login successful",
				user: parsedUser,
				sessionId,
			});
		} catch (error) {
			console.error("Error during login:", error);
			return c.json({ error: "An error occurred during login" }, 500);
		}
	})

	// ユーザー登録APIエンドポイント
	.post("/register", zValidator("json", RegisterParam), async (c) => {
		const param = c.req.valid("json");

		try {
			// ユーザーを作成
			await userModel.createUser(
				c.env.DB,
				param.id,
				param.name,
				param.role,
				param.password,
			);

			return c.json({ message: "User created" });
		} catch (error) {
			console.error("Error during registration:", error);
			return c.json({ error: "An error occurred during registration" }, 500);
		}
	})

	// ログアウトAPIエンドポイント
	.post("/logout", checkSession, async (c) => {
		try {
			console.log("logout");
			return c.json({ message: "Logout successful" });
		} catch (e) {
			return c.json({ error: "An error occurred during logout" }, 500);
		}
	});

export default api;
