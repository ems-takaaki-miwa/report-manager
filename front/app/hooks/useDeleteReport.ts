import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { currentPageAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { deleteReport } from "~/lib/report";
import { GetQueryKey } from "~/lib/utils";

type UseDeleteProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const useDeleteReport = ({ ref }: UseDeleteProps) => {
	const { showToast } = useToast();
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
	const queryClient = useQueryClient();

	const { mutate, data, error, isPending } = useMutation({
		mutationFn: deleteReport,
		onSuccess: () => {
			showToast({
				message: "削除しました",
				variant: "success",
			});
			queryClient.refetchQueries({ queryKey: GetQueryKey(currentPage) });
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
