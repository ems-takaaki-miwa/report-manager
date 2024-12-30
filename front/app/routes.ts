import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;

// export default [
// 	index("routes/home.tsx"),
// 	route("login", "routes/auth/login.tsx"),
//     route("/:fileId", "routes/files/fileDetail.tsx"),
// ] satisfies RouteConfig;
