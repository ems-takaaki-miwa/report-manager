import { useState } from "react";

export default function UploadReport() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear(),
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1,
	);

	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month, 0).getDate();
	}

	return (
		<div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
			<h2 className="text-lg font-bold my-4">レポートアップロード</h2>
			<form className="w-full sm:w-120 flex flex-col gap-6 p-4 sm:p-8 bg-base-200 rounded-lg shadow-sm">
				<label className="flex flex-col gap-2">
					<span>種別</span>
					<div className="space-x-4">
						<input
							id="daily"
							type="radio"
							name="type"
							className="radio"
							defaultChecked
						/>
						<label htmlFor="daily">日報</label>
						<input id="monthly" type="radio" name="type" className="radio" />
						<label htmlFor="monthly">月報</label>
						<input id="annual" type="radio" name="type" className="radio" />
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
					<span>対象日付</span>
					<div className="flex gap-4">
						<select
							className="select select-bordered w-25 max-w-xs"
							onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
							value={selectedYear}
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
						<select
							className="select select-bordered w-25 max-w-xs"
							onChange={(e) =>
								setSelectedMonth(Number.parseInt(e.target.value))
							}
							value={selectedMonth}
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
						<select className="select select-bordered w-25 max-w-xs">
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
					</div>
				</label>
				<button type="submit" className="btn btn-primary">
					アップロード
				</button>
			</form>
		</div>
	);
}
