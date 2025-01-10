import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { currentPageAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { uploadReport } from "~/lib/report";
import { GetQueryKey } from "~/lib/utils";

type useUploadProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const useUploadReport = ({ ref }: useUploadProps) => {
	const { showToast } = useToast();
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
	const queryClient = useQueryClient();

	const { mutate, data, error, isPending } = useMutation({
		mutationFn: uploadReport,
		onSuccess: (data) => {
			showToast({
				message: "アップロードしました",
				variant: "success",
			});
			if (currentPage?.reportType === data?.type) {
				queryClient.invalidateQueries({ queryKey: GetQueryKey(currentPage) });
			}
			ref.current?.close();
		},
		onError: (error) => {
			showToast({
				message: error.message,
				variant: "error",
			});
		},
	});

	return {
		mutate,
		data,
		isPending,
		error,
	};
};
