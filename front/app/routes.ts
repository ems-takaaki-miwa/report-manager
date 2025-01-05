import {
	type RouteConfig,
	index,
	route,
	layout,
} from "@react-router/dev/routes";

export default [
	layout("./layouts/layout.tsx", [
		route("login", "routes/login.tsx"),
		layout("./layouts/reportsLayout.tsx", [
			index("routes/dailyReports.tsx"),
			route("monthly-reports", "routes/monthlyReports.tsx"),
			route("annual-reports", "routes/annualReports.tsx"),
		]),
	]),
] satisfies RouteConfig;
