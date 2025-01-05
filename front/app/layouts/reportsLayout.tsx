import React from "react";
import { Outlet, useLocation, NavLink } from "react-router";

const ReportsLayout: React.FC = () => {
	let location = useLocation();

	const getTabClassName = (path: string): string => {
		const isActive = location.pathname === path;
		return `tab transition-[border-color] duration-300 ease-in-out ${isActive ? "tab-active" : ""}`;
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
