import { useAtom } from "jotai/react";
import { useState } from "react";
import { userAtom } from "~/atoms";
import { useToast } from "~/hooks/use-toast";
import { hono } from "~/lib/hono";

export const useUploadReport = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [user] = useAtom(userAtom);
	const { toast } = useToast();

	const uploadReport = async (reportData: {
		title: string;
		type: string;
		year: number;
		month: number;
		day: number;
	}) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			const response = await hono.api.reports.create.$post(
				{
					json: {
						...reportData,
						uploaderId: user?.id as string,
					},
				},
				{
					headers: {
						"Session-Id": user?.sessionId || "",
					},
				},
			);

			if (response.ok) {
				toast({
					variant: "info",
					title: "アップロード成功",
					description: "レポートをアップロードしました。",
				});
			} else {
				toast({
					variant: "error",
					title: "アップロード失敗",
					description: "レポートのアップロードに失敗しました。",
				});
			}
		} catch (error) {
			console.error("Error uploading report:", error);
			toast({
				variant: "error",
				title: "エラーが発生しました",
				description: "レポートのアップロード中にエラーが発生しました。",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { uploadReport, isLoading };
};
