import { useAtom } from "jotai";
import { useRef } from "react";
import { reportAtom } from "~/atoms";
import { useDownloadReport } from "~/hooks/useDownloadReport";
import { useEditReport } from "~/hooks/useEditReport";
import type { Report } from "~/types/report";
import { DeleteReportModal } from "../deleteReportModal";
import { ReportFormModal } from "../reportFormModal";

type ReportMenuButtonProps = {
	report: Report;
};

export const ReportMenuButton: React.FC<ReportMenuButtonProps> = ({
	report,
}) => {
	const [reportState, setReportState] = useAtom(reportAtom);
	const deleteDialogRef = useRef<HTMLDialogElement | null>(null);
	const formDialogRef = useRef<HTMLDialogElement | null>(null);
	const { mutate, isPending } = useEditReport({ ref: formDialogRef });
	const downloadMutation = useDownloadReport();

	return (
		<div className="dropdown dropdown-end">
			<DeleteReportModal ref={deleteDialogRef} report={report} />
			<ReportFormModal
				ref={formDialogRef}
				report={report}
				usecase="edit"
				submitAction={mutate}
				isLoading={isPending}
			/>
			<button type="button" className="btn btn-ghost btn-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					className="w-4 h-4"
					stroke="currentColor"
				>
					<title>menu</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
					/>
				</svg>
			</button>
			<ul className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<button
						type="button"
						className="flex items-center gap-2"
						onClick={async () => await downloadMutation.mutate({ report })}
						disabled={downloadMutation.isPending}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="w-4 h-4"
							stroke="currentColor"
						>
							<title>download</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						ダウンロード
					</button>
				</li>
				<li>
					<button
						type="button"
						onClick={() => formDialogRef.current?.showModal()}
						className="flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="w-4 h-4"
							stroke="currentColor"
						>
							<title>編集</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						編集
					</button>
				</li>
				<li>
					<button
						type="button"
						className="flex items-center gap-2 text-error"
						onClick={() => deleteDialogRef.current?.showModal()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="w-4 h-4"
							stroke="currentColor"
						>
							<title>削除</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						削除
					</button>
				</li>
			</ul>
		</div>
	);
};
