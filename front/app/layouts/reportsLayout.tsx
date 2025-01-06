import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useUserStore } from "../stores/userStore";

// export async function clientLoader() {
// 	// ここでログインしてるかをチェックする
// 	// ログインしていない場合はリダイレクトする
// 	const user = localStorage.getItem("user");
// 	if (!user) {
// 		return redirect("/login");
// 	}
// 	return null;
// }

const ReportsLayout: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();

	useEffect(() => {
		if (user === null) {
			navigate("/login");
		}
	}, [user]);

	const getTabClassName = (isActive: boolean): string => {
		return `tab ${isActive ? "tab-active" : ""}`;
	};

	return (
		<div className="w-full bg-base-200">
			<div role="tablist" className="tabs tabs-border sticky top-0  z-10 p-4">
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
