import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { currentPageAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { editReport } from "~/lib/report";
import { GetQueryKey } from "~/lib/utils";

type useEditProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const useEditReport = ({ ref }: useEditProps) => {
	const { showToast } = useToast();
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

	const { mutate, data, error, isPending } = useMutation({
		mutationFn: editReport,
		onSuccess: (data) => {
			showToast({
				message: "更新しました。",
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
