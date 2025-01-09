import { formatDate } from "~/lib/utils/dateUtils";
import type { Report } from "~/types/report";
import { DownloadButton } from "./ui/downloadButton";
import { ReportMenuButton } from "./ui/reportMenuButton";

interface ReportTableProps {
	reports: Report[];
	type: "daily" | "monthly" | "annual";
}

const ReportTable: React.FC<ReportTableProps> = ({ reports, type }) => {
	const getDateHeader = () => {
		switch (type) {
			case "daily":
				return "日付";
			case "monthly":
				return "月";
			case "annual":
				return "年";
		}
	};

	const getDateCell = (report: Report) => {
		switch (type) {
			case "daily":
				return `${(report as Report).day}日`;
			case "monthly":
				return `${report.month}月`;
			case "annual":
				return `${report.year}年`;
		}
	};

	return (
		<div className="w-full">
			<table className="table bg-base-100 w-full">
				<thead>
					<tr>
						<th className="text-center whitespace-nowrap">{getDateHeader()}</th>
						<th className="text-center whitespace-nowrap">タイトル</th>
						<th className="text-center whitespace-nowrap">更新日</th>
						<th className="text-center whitespace-nowrap" />
					</tr>
				</thead>
				<tbody>
					{reports.map((report) => (
						<tr key={report.id}>
							<td className="text-center whitespace-nowrap">
								{getDateCell(report)}
							</td>
							<td className="text-center break-all">{report.title}</td>
							<td className="text-center whitespace-nowrap">
								{formatDate(report.updatedAt)}
							</td>
							<td className="text-center whitespace-nowrap">
								<ReportMenuButton report={report} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
