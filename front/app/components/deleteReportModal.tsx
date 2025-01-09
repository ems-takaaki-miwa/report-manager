import { getReportTypeLabel } from "~/lib/utils";
import { formatDate } from "~/lib/utils/dateUtils";
import type { Report } from "~/types/report";
import { useDeleteReport } from "../hooks/useDeleteReport";

type DeleteModalProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
	report: Report;
};

export const DeleteReportModal: React.FC<DeleteModalProps> = ({
	ref,
	report,
}) => {
	const { mutate, isPending } = useDeleteReport({ ref });
	const handleDelete = () => {
		mutate(report);
		// ref.current?.close();
	};
	return (
		<dialog id="my_modal_1" className="modal" ref={ref}>
			<div className="modal-box">
				<h3 className="font-bold text-lg my-4">本当に削除しますか？</h3>
				<div className="modal-content flex flex-col gap4">
					{/* タイトルとファイル名 */}
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">種別</span>
						<span className="w-1/2 text-left px-2">
							{getReportTypeLabel(report.type)}
						</span>
					</div>
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">タイトル</span>
						<span className="w-1/2 text-left px-2">{report.title}</span>
					</div>
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">更新日</span>
						<span className="w-1/2 text-left px-2">
							{formatDate(report.updatedAt)}
						</span>
					</div>
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">作成日</span>
						<span className="w-1/2 text-left px-2">
							{formatDate(report.createdAt)}
						</span>
					</div>
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">作成者</span>
						<span className="w-1/2 text-left px-2">{report.uploaderId}</span>
					</div>
					{/* 年月日を1行にまとめる */}
					<div className="flex w-full">
						<span className="w-1/2 font-bold text-right px-2">日付</span>
						<span className="w-1/2 text-left px-2">
							{`${report.year}年${report.month}月${report.day}日`}
						</span>
					</div>
				</div>
				<div className="my-4 flex gap-4 justify-center">
					<button
						type="button"
						className="btn btn-error"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? (
							<span className="loading loading-spinner loading-md" />
						) : (
							"削除"
						)}
					</button>
					<button
						type="button"
						className="btn"
						onClick={() => ref.current?.close()}
						disabled={isPending}
					>
						キャンセル
					</button>
				</div>
			</div>
		</dialog>
	);
};
