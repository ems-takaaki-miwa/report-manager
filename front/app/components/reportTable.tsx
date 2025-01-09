export type Report = {
	id: number;
	type: string;
	year: number;
	month: number;
	day: number;
	title: string;
	uploaderId: string;
	updatedAt: string | null;
	createdAt: string | null;
};

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

	const formatDate = (dateString: string | null): string => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
	};

	return (
		<div className="overflow-x-auto w-full">
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
								<button type="button" className="btn btn-primary btn-sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="20px"
										viewBox="0 -960 960 960"
										width="20px"
										className="fill-current"
									>
										<title>download</title>
										<path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
									</svg>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
