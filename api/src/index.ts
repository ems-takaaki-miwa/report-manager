import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import fileApi from "./apis/fileApi";
import authApi from "./apis/authApi";
import { Bindings } from "./bindings";

const app = new Hono<{ Bindings: Bindings }>();
app.get("/", (c) => c.text("Pretty Blog API"));
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

// middlewareの記述や、APIのルーティングの記述を追加していく

const middleware = new Hono<{ Bindings: Bindings }>();
middleware.use("*", prettyJSON());
// api/のログイン以外に対しては、セッションのチェックをする
// セッションのチェックにはkvを利用する。
// また、セッションIDはCookieに保存される。
// middleware.use('/posts/*', async (c, next) => {
//   if (c.req.method !== 'GET') {
//     const auth = basicAuth({ username: c.env.USERNAME, password: c.env.PASSWORD })
//     return auth(c, next)
//   } else {
//     await next()
//   }
// })
middleware.use(
	"/api/*",
	cors({
		origin: "*", // ここを変更することで、許可するオリジンを変更できる
	}),
);

app.route("/api", middleware);
app.route("/api/files", fileApi);
app.route("/api/auth", authApi);

// Module Workerによるサーバーの起動
export default app;
