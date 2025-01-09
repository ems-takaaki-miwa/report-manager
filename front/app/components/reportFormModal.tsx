import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutateFunction } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { getDaysInMonth } from "~/lib/utils/dateUtils";
import type { FormActionProps, Report } from "~/types/report";
import { editSchema, uploadSchema } from "~/validations/reportSchema";

type UploadFormInput = z.infer<typeof uploadSchema>;
type EditFormInput = z.infer<typeof editSchema>;

type ReportFormModalProps = {
	submitAction: UseMutateFunction<Report, Error, FormActionProps, unknown>;
	isLoading: boolean;
	report?: Report;
	usecase: "upload" | "edit";
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
	submitAction,
	isLoading,
	report,
	usecase,
	ref,
}) => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<
		typeof usecase extends "upload" ? UploadFormInput : EditFormInput
	>({
		resolver: zodResolver(usecase === "upload" ? uploadSchema : editSchema),
		defaultValues: {
			type: usecase === "edit" ? report?.type : "daily",
			title: usecase === "edit" ? report?.title : "",
			year: usecase === "edit" ? report?.year : new Date().getFullYear(),
			month: usecase === "edit" ? report?.month : new Date().getMonth() + 1,
			day: usecase === "edit" ? report?.day : new Date().getDate(),
		},
	});
	const onSubmit: SubmitHandler<UploadFormInput | EditFormInput> = async (
		data,
	) => {
		await submitAction({
			report: {
				id: usecase === "edit" ? (report?.id ?? 0) : 0,
				uploaderId: "", // Add appropriate value
				createdAt: "", // Add appropriate value
				updatedAt: "", // Add appropriate value
				title: data.title,
				type: data.type,
				year: data.year,
				month: data.month,
				day: data.day,
			},
			reset,
		});
	};
	const selectedType = watch("type");
	const selectedYear = watch("year");
	const selectedMonth = watch("month");
	return (
		<dialog id="form_dialog" className="modal" ref={ref}>
			<div className="modal-box">
				<h3 className="font-bold text-lg my-4 text-center">
					{usecase === "upload" ? "アップロード" : "編集"}
				</h3>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full flex flex-col gap-6 sm:p-8 text-left"
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
						<span>
							ファイル{" "}
							{usecase === "edit" ? (
								<span className="text-xs text-info ml-2">
									*変更したい場合のみファイルを選択してください
								</span>
							) : (
								""
							)}
						</span>
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
					<div className="flex gap-4 justify-center mt-4">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="loading loading-spinner loading-md" />
							) : (
								"送信"
							)}
						</button>
						<button
							type="button"
							className="btn"
							onClick={() => ref.current?.close()}
							disabled={isLoading}
						>
							キャンセル
						</button>
					</div>
				</form>
			</div>
		</dialog>
	);
};
