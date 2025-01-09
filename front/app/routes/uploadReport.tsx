import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { UploadButton } from "~/components/ui/uploadButton";
import { useUploadReport } from "~/hooks/useUploadReport";
import { getDaysInMonth } from "~/lib/utils/dateUtils";

const FormSchema = z.object({
	type: z.enum(["daily", "monthly", "annual"], {
		required_error: "種別の選択は必須です",
	}),
	file: z
		.any()
		.refine((files) => files && files.length > 0, {
			message: "ファイルを選択してください",
		})
		.refine(
			(files) => {
				if (!files || files.length === 0) return false;
				return ["application/pdf"].includes(files[0].type);
			},
			{
				message: "PDFファイルのみアップロード可能です",
			},
		),
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	year: z
		.number()
		.int("年は整数で入力してください")
		.min(2000, "2000年以降を選択してください")
		.max(2100, "2100年までを選択してください"),
	month: z
		.number()
		.int("月は整数で入力してください")
		.min(1, "1月から12月の間で選択してください")
		.max(12, "1月から12月の間で選択してください"),
	day: z
		.number()
		.int("日は整数で入力してください")
		.min(1, "1日から31日の間で選択してください")
		.max(31, "1日から31日の間で選択してください"),
});

type FormInput = z.infer<typeof FormSchema>;

export default function UploadReport() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			type: "daily",
			title: "",
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			day: new Date().getDate(),
		},
	});
	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		console.log(data);
		await uploadReport({
			title: data.title,
			type: data.type,
			year: data.year,
			month: data.month,
			day: data.day,
		});
	};
	const selectedType = watch("type");
	const selectedYear = watch("year");
	const selectedMonth = watch("month");

	const { uploadReport, isLoading } = useUploadReport();

	return (
		<div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
			<h2 className="text-lg font-bold my-4">レポートアップロード</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full sm:w-120 flex flex-col gap-6 p-4 sm:p-8 bg-base-200 rounded-lg shadow-sm"
			>
				<label className="flex flex-col gap-2">
					<span>種別</span>
					<div className="space-x-4">
						<input
							id="daily"
							type="radio"
							value="daily"
							className="radio"
							{...register("type", { required: true })}
						/>
						<label htmlFor="daily">日報</label>
						<input
							id="monthly"
							type="radio"
							value="monthly"
							className="radio"
							{...register("type", { required: true })}
						/>
						<label htmlFor="monthly">月報</label>
						<input
							id="annual"
							type="radio"
							value="annual"
							className="radio"
							{...register("type", { required: true })}
						/>
						<label htmlFor="annual">年報</label>
					</div>
					{errors?.type?.message && <p>{errors.type.message}</p>}
				</label>
				<label className="flex flex-col gap-2">
					<span>ファイル</span>
					<input
						{...register("file", { required: true })}
						type="file"
						accept=".pdf"
						className={`file-input file-input-bordered w-full ${errors?.file ? "file-input-error" : "file-input-neutral"}`}
					/>
					{errors?.file?.message && (
						<p className="text-error">{String(errors.file.message)}</p>
					)}
				</label>
				<label className="flex flex-col gap-2">
					<span>タイトル</span>
					<input
						{...register("title", { required: true })}
						className={`input w-full ${errors?.title ? "input-error" : ""}`}
					/>
					{errors?.title?.message && (
						<p className="text-error">{errors.title.message}</p>
					)}
				</label>
				<label className="flex flex-col gap-2">
					<span>
						{selectedType === "daily" && "対象日次"}
						{selectedType === "monthly" && "対象月次"}
						{selectedType === "annual" && "対象年次"}
					</span>
					<div className="flex gap-4">
						<select
							{...register("year", { required: true, valueAsNumber: true })}
							className="select select-bordered w-25 max-w-xs"
						>
							<option disabled value="">
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
						{(selectedType === "daily" || selectedType === "monthly") && (
							<select
								{...register("month", {
									required:
										selectedType === "monthly" || selectedType === "daily",
									valueAsNumber: true,
								})}
								className="select select-bordered w-25 max-w-xs"
							>
								<option disabled value="">
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
						{selectedType === "daily" && (
							<select
								{...register("day", {
									required: selectedType === "daily",
									valueAsNumber: true,
								})}
								className="select select-bordered w-25 max-w-xs"
							>
								<option disabled value="">
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
				<UploadButton disabled={isLoading} />
			</form>
		</div>
	);
}
