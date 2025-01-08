import type React from "react";
import { useAnnualReports } from "~/hooks/useAnualReports";
import ReportTable, { type Report } from "../components/reportTable";

const AnualReports: React.FC = () => {
	const { data, isLoading, error } = useAnnualReports();

	if (error) {
		console.log(typeof error);
		return <div className="text-red-500 p-4">error</div>;
	}

	if (isLoading) {
		return (
			<div className="p-4">
				<div className="flex w-full flex-col gap-4">
					<div className="skeleton h-4 w-full" />
					<div className="skeleton h-72 w-full" />
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			<ReportTable reports={data ?? []} type="annual" />
		</div>
	);
};

export default AnualReports;
