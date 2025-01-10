import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { currentPageAtom } from "~/atoms";
import { useToast } from "~/hooks/useToast";
import { hono } from "~/lib/hono";
import { GetQueryKey, getStorageUser, removeStorageUser } from "~/lib/utils";
import type { FormActionProps, Report } from "~/types/report";

type useEditProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const useEditReport = ({ ref }: useEditProps) => {
	const navigate = useNavigate();
	const user = getStorageUser();
	const { showToast } = useToast();
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

	const editReport = useCallback(
		async (props: FormActionProps) => {
			const response = await hono.api.reports.update.$post(
				{
					json: {
						id: props.report.id,
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
				// props.reset();
				const data = await response.json();
				return data.report as Report;
			}
			const status: number = response.status;
			switch (status) {
				case 400:
					throw new Error("パラメータに誤りがあります。");
				case 422:
					throw new Error("更新できませんでした。");
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
		mutationFn: editReport,
		onSuccess: (data) => {
			showToast({
				message: "更新しました。",
				variant: "success",
			});
			console.log(currentPage?.reportType);
			console.log(data.type);
			if (currentPage?.reportType === data.type) {
				console.log("aaa");
				queryClient.invalidateQueries({ queryKey: GetQueryKey(currentPage) });
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
