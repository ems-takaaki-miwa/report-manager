import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { currentPageAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { hono } from "~/lib/hono";
import { GetQueryKey, getStorageUser, removeStorageUser } from "~/lib/utils";
import type { FormActionProps, Report } from "~/types/report";

type useUploadProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const useUploadReport = ({ ref }: useUploadProps) => {
	const navigate = useNavigate();
	const user = getStorageUser();
	const { showToast } = useToast();
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
	const queryClient = useQueryClient();

	const uploadReport = useCallback(
		async (props: FormActionProps) => {
			console.log("uploadReport");
			const response = await hono.api.reports.create.$post(
				{
					json: {
						title: props.report.title,
						day: props.report.day,
						month: props.report.month,
						year: props.report.year,
						type: props.report.type,
						uploaderId: user?.id || "",
					},
				},
				{
					headers: {
						"Session-Id": user?.sessionId || "", // レイアウト部分であることは確認済みなので、ほんとはチェック不要
					},
				},
			);
			if (response.ok) {
				console.log("uploadReport success");
				props.reset();
				const data = await response.json();

				return data.report as Report;
			}
			console.log("uploadReport error");
			const status: number = response.status;
			switch (status) {
				case 400:
					throw new Error("パラメータに誤りがあります。");
				case 422:
					throw new Error("アップロードできませんでした。");
				case 401:
					removeStorageUser();
					navigate("/login");
					throw new Error("セッションの有効期限が切れました。");
				case 500:
					throw new Error("サーバーエラーが発生しました");
				default:
					throw new Error("不明なエラーが発生しました");
			}
		},
		[navigate, user],
	);

	const { mutate, data, error, isPending } = useMutation({
		mutationFn: uploadReport,
		onSuccess: (data) => {
			showToast({
				message: "アップロードしました",
				variant: "success",
			});
			if (currentPage?.reportType === data.type) {
				queryClient.invalidateQueries({ queryKey: GetQueryKey(currentPage) });
				// await queryClient.refetchQueries({ queryKey: GetQueryKey(currentPage) });
			}
			ref.current?.close();
		},
	});

	return {
		mutate,
		data,
		isPending,
		error,
	};
};
