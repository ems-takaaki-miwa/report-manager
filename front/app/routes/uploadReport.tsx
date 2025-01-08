import { UploadButton } from "~/components/ui/uploadButton";
import { useUploadReport } from "~/hooks/useUploadReport";
import { useReportForm } from "~/hooks/useReportForm";
import { getDaysInMonth } from "~/lib/utils/dateUtils";

export default function UploadReport() {
  const {
    reportType,
    setReportType,
    inputTitle,
    setInputTitle,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useReportForm();
  
  const { uploadReport, isLoading } = useUploadReport();

  const handleSubmit = async (formData: FormData) => {
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const year = Number(formData.get("year"));
    const month = Number(formData.get("month"));
    const day = Number(formData.get("day"));
    
    await uploadReport({ title, type, year, month, day });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 mx-auto items-center justify-center">
      <h2 className="text-lg font-bold my-4">レポートアップロード</h2>
      <form
        action={handleSubmit}
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
              checked={reportType === "daily"}
              onChange={(e) => setReportType(e.target.value)}
            />
            <label htmlFor="daily">日報</label>
            <input
              id="monthly"
              type="radio"
              name="type"
              value="monthly"
              className="radio"
              checked={reportType === "monthly"}
              onChange={(e) => setReportType(e.target.value)}
            />
            <label htmlFor="monthly">月報</label>
            <input
              id="annual"
              type="radio"
              name="type"
              value="annual"
              className="radio"
              checked={reportType === "annual"}
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
          <input
            name="title"
            className="input w-full"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            required
          />
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
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              value={selectedYear}
              required
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
            {(reportType === "daily" || reportType === "monthly") && (
              <select
                name="month"
                className="select select-bordered w-25 max-w-xs"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth}
                required={reportType === "daily" || reportType === "monthly"}
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
            {reportType === "daily" && (
              <select
                name="day"
                className="select select-bordered w-25 max-w-xs"
                required={reportType === "daily"}
                defaultValue={1}
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
                  }
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
