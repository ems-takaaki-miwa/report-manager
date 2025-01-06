import React from "react";
import { Outlet, useLocation, NavLink, redirect } from "react-router";

export async function clientLoader() {
	// ここでログインしてるかをチェックする
	// ログインしていない場合はリダイレクトする
	const user = localStorage.getItem("user");
	console.log(user);
	if (!user) {
		return redirect("/login");
	}
	return null;
}

const ReportsLayout: React.FC = () => {
	let location = useLocation();

	const getTabClassName = (path: string): string => {
		const isActive = location.pathname === path;
		return `tab ${isActive ? "tab-active [--tab-border-color:red]" : ""}`;
	};

	return (
		<div className="w-full bg-base-200">
			<div role="tablist" className="tabs tabs-border sticky top-0  z-10 p-4">
				<NavLink to="/" role="tab" className={getTabClassName("/")}>
					日報
				</NavLink>
				<NavLink
					to="/monthly-reports"
					role="tab"
					className={getTabClassName("/monthly-reports")}
				>
					月報
				</NavLink>
				<NavLink
					to="/annual-reports"
					role="tab"
					className={getTabClassName("/annual-reports")}
				>
					年報
				</NavLink>
			</div>
			<Outlet />
		</div>
	);
};

export default ReportsLayout;
