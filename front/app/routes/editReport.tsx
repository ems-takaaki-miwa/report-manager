import { useAtom } from "jotai";
import { reportAtom } from "~/atoms";
import { ReportForm } from "~/components/reportForm";
import { useEditReport } from "~/hooks/useEditReport";
import type { Report } from "~/types/report";

export default function EditReport() {
	const { mutate, isPending } = useEditReport();
	const [reportState, setReportState] = useAtom(reportAtom);

	return (
		<div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
			<h2 className="text-lg font-bold my-4">レポート編集</h2>
			<ReportForm
				submitAction={mutate}
				isLoading={isPending}
				buttonLabel="更新"
				report={reportState as Report}
				usecase="edit"
			/>
		</div>
	);
}
