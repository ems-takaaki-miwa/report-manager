import { ReportForm } from "~/components/reportForm";
import { useUploadReport } from "~/hooks/useUploadReport";

export default function UploadReport() {
	const { uploadReport, isLoading } = useUploadReport();

	return (
		<div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
			<h2 className="text-lg font-bold my-4">レポートアップロード</h2>
			<ReportForm
				submitAction={uploadReport}
				isLoading={isLoading}
				label="アップロード"
			/>
		</div>
	);
}
