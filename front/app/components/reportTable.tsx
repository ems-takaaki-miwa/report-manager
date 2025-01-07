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
				return `${report.day}日`;
			case "monthly":
				return `${report.month}月`;
			case "annual":
				return `${report.year}年`;
		}
	};

	return (
		<table className="table bg-base-100 w-full">
			<thead>
				<tr>
					<th className="text-center">{getDateHeader()}</th>
					<th className="text-center">タイトル</th>
					<th className="text-center">更新日</th>
					<th className="text-center"></th>
				</tr>
			</thead>
			<tbody>
				{reports.map((report) => (
					<tr key={report.id}>
						<td>{getDateCell(report)}</td>
						<td>{report.title}</td>
						<td>{report.updatedAt}</td>
						<td>
							<button className="btn btn-primary btn-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									className="fill-current"
								>
									<path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
								</svg>
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ReportTable;
