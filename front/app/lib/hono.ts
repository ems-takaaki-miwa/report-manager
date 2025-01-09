import { hc } from "hono/client";

import { type AppType } from "../../../api/src/index";

const API_URL = import.meta.env.PROD
	? "https://api.miwa-takaaki.workers.dev/"
	: "http://127.0.0.1:8787/";

export const hono = hc<AppType>(API_URL);
