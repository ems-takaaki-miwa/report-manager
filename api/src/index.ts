import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import authApi from "./apis/authApi";
import reportApi from "./apis/reportApi";
import type { Bindings } from "./bindings";

const middleware = new Hono<{ Bindings: Bindings }>()
	.use("*", prettyJSON())
	.use(
		"*",
		cors({
			origin: [
				"http://localhost:5173",
				"https://report-manager.pages.dev/login",
			], // ここを変更することで、許可するオリジンを変更できる
		}),
	);

const app = new Hono<{ Bindings: Bindings }>()
	.get("/", (c) => c.text("Pretty Blog API"))
	.notFound((c) => c.json({ message: "Not Found", ok: false }, 404))
	.route("/api", middleware)
	.route("/api/reports/", reportApi)
	.route("/api/auth", authApi);

export type AppType = typeof app;

// Module Workerによるサーバーの起動
export default app;
