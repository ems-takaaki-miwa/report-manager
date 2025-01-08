import { useAtom } from "jotai/react";
import { useState } from "react";
import { userAtom } from "~/atoms";
import { UploadButton } from "~/components/ui/uploadButton";
import { hono } from "~/lib/hono";
import { useToast } from "~/hooks/use-toast";

export default function UploadReport() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1,
	);
	const [user, setUserAtom] = useAtom(userAtom);
	const [reportType, setReportType] = useState<string>("");

	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month, 0).getDate();
	}
	const { toast } = useToast();

	const UploadReport = async (formData: FormData) => {
		const type: string = (await formData.get("type")) as string;
		const title: string = (await formData.get("title")) as string;
		const year: number = Number(await formData.get("year"));
		const month: number = Number(await formData.get("month"));
		const day: number = Number(await formData.get("day"));
		try {
			const response = await hono.api.reports.create.$post(
				{
					json: {
						title: title,
						type: type,
						day: day,
						month: month,
						year: year,
						uploaderId: user?.id as string,
					},
				},
				{
					headers: {
						"Session-Id": user?.sessionId || "", // レイアウト部分であることは確認済みなので、ほんとはチェック不要
					},
				},
			);
			if (response.ok) {
				const data = await response.json();
				toast({
					title: "アップロード成功",
					description: "レポートをアップロードしました。",
				})
				console.log(data);
			} else {
				toast({
					variant: "error",
					title: "アップロード失敗",
					description: "レポートのアップロードに失敗しました。",
				})
				console.error("Failed to upload report");
			}
		} catch (error) {
			console.error("Error uploading report:", error);
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
			<h2 className="text-lg font-bold my-4">レポートアップロード</h2>
			<form
				action={UploadReport}
				className="w-full sm:w-120 flex flex-col gap-6 p-4 sm:p-8 bg-base-200 rounded-lg shadow-sm"
			>
				<label className="flex flex-col gap-2">
					<span>種別</span>
					<div className="space-x-4">
						<input
							id="daily"
							type="radio"
							name="type"
							value="daily"
							className="radio"
							defaultChecked
							onChange={(e) => setReportType(e.target.value)}
						/>
						<label htmlFor="daily">日報</label>
						<input
							id="monthly"
							type="radio"
							name="type"
							value="monthly"
							className="radio"
							onChange={(e) => setReportType(e.target.value)}
						/>
						<label htmlFor="monthly">月報</label>
						<input
							id="annual"
							type="radio"
							name="type"
							value="annual"
							className="radio"
							onChange={(e) => setReportType(e.target.value)}
						/>
						<label htmlFor="annual">年報</label>
					</div>
				</label>
				<label className="flex flex-col gap-2">
					<span>ファイル</span>
					<input
						type="file"
						accept=".pdf"
						className="file-input file-input-bordered w-full file-input-neutral"
					/>
				</label>
				<label className="flex flex-col gap-2">
					<span>タイトル</span>
					<input name="title" className="input w-full" required />
				</label>

				<label className="flex flex-col gap-2">
					<span>
						{reportType === "daily" && "対象日次"}
						{reportType === "monthly" && "対象月次"}
						{reportType === "annual" && "対象年次"}
					</span>
					<div className="flex gap-4">
						<select
							name="year"
							className="select select-bordered w-25 max-w-xs"
							onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
							value={selectedYear}
							required
						>
							<option disabled selected>
								年
							</option>
							{Array.from({ length: 11 }, (_, i) => {
								const year = new Date().getFullYear() - 5 + i;
								return (
									<option key={year} value={year}>
										{year}年
									</option>
								);
							})}
						</select>
						{(reportType === "daily" || reportType === "monthly") && (
							<select
								name="month"
								className="select select-bordered w-25 max-w-xs"
								onChange={(e) =>
									setSelectedMonth(Number.parseInt(e.target.value))
								}
								value={selectedMonth}
								required={reportType === "daily" || reportType === "monthly"}
							>
								<option disabled selected>
									月
								</option>
								{Array.from({ length: 12 }, (_, i) => {
									const month = i + 1;
									return (
										<option key={month} value={month}>
											{month}月
										</option>
									);
								})}
							</select>
						)}
						{reportType === "daily" && (
							<select
								name="day"
								className="select select-bordered w-25 max-w-xs"
								required={reportType === "daily"}
								defaultValue={1}
							>
								<option disabled selected>
									日
								</option>
								{Array.from(
									{ length: getDaysInMonth(selectedYear, selectedMonth) },
									(_, i) => {
										const day = i + 1;
										return (
											<option key={day} value={day}>
												{day}日
											</option>
										);
									},
								)}
							</select>
						)}
					</div>
				</label>
				<UploadButton />
			</form>
		</div>
	);
}
