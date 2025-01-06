import { hc } from "hono/client";

import { type AppType } from "../../../api/src/index";

export const hono = hc<AppType>("http://127.0.0.1:8787/");
