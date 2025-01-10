import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "~/lib/report";
import { FetchReportsQueryKey, type Report } from "~/types/report";

export const useAnnualReports = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: [FetchReportsQueryKey.ANNUAL],
		queryFn: () =>
			fetchReports({ type: FetchReportsQueryKey.ANNUAL, year: 0, month: 0 }),
	});

	return {
		data,
		isLoading,
		error,
	};
};
