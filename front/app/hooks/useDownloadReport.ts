import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { userAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { downloadReport } from "~/lib/report";
import type { Report } from "~/types/report";

export const useDownloadReport = () => {
	const { showToast } = useToast();
	const mutation = useMutation({
		mutationFn: downloadReport,
		onSuccess: () => {
			showToast({
				message: "ダウンロードしました",
				variant: "success",
			});
		},
		onError: (error) => {
			showToast({
				message: error.message,
				variant: "error",
			});
		},
		mutationKey: ["downloadReport"],
	});

	return mutation;
};
