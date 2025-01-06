import { Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import { Bindings } from "../bindings";
import * as sessionModel from "../models/sessionModel";
import { createMiddleware } from "hono/factory";
// createMiddleware関数を使って、ミドルウェアを作成する

export const checkSession = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		const errorResponse = c.json(
			{ error: "You do not have permission to access this resource." },
			401,
		);

		const sessionId = c.req.header('Session-Id');
		if (sessionId == null) {
			return errorResponse;
		}
		try {
			const value = await c.env.MY_KV.get(sessionId);
			// KVの有無のチェック
			if (!value) {
				return errorResponse;
			}
			// 期限が切れてないかをチェック
			const sessionData: sessionModel.Session = JSON.parse(value);
			if (sessionData.expires <= Date.now()) {
				return errorResponse;
			}
			await next();
		} catch (e) {
			return c.json({ error: "An error occurred during session check" }, 500);
		}
	},
);
