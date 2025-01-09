import type React from "react";
import { NavLink, Outlet, redirect } from "react-router";
import { getStorageUser } from "~/lib/utils";

export async function clientLoader() {
	// ここでログインしてるかをチェックする
	// ログインしていない場合はリダイレクトする
	const user = getStorageUser();
	if (user == null) {
		return redirect("/login");
	}
	return null;
}

const ReportsLayout: React.FC = () => {
	const getTabClassName = (isActive: boolean): string => {
		return `tab ${isActive ? "tab-active" : ""}`;
	};

	return (
		<div className="my-4 w-full bg-base-200 rounded-lg">
			<div
				role="tablist"
				className="tabs tabs-border bg-base-200 rounded-lg sticky top-0  z-10 p-4"
			>
				<NavLink
					to="/"
					role="tab"
					className={({ isActive }) => getTabClassName(isActive)}
				>
					日報
				</NavLink>
				<NavLink
					to="/monthly-reports"
					role="tab"
					className={({ isActive }) => getTabClassName(isActive)}
				>
					月報
				</NavLink>
				<NavLink
					to="/annual-reports"
					role="tab"
					className={({ isActive }) => getTabClassName(isActive)}
				>
					年報
				</NavLink>
			</div>
			<Outlet />
		</div>
	);
};

export default ReportsLayout;
