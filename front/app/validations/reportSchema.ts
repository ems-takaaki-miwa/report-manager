import * as z from "zod";

const baseSchema = z.object({
	type: z.enum(["daily", "monthly", "annual"], {
		required_error: "種別の選択は必須です",
	}),
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	year: z
		.number()
		.int("年は整数で入力してください")
		.min(2000, "2000年以降を選択してください")
		.max(2100, "2100年までを選択してください"),
	month: z
		.number()
		.int("月は整数で入力してください")
		.min(1, "1月から12月の間で選択してください")
		.max(12, "1月から12月の間で選択してください"),
	day: z
		.number()
		.int("日は整数で入力してください")
		.min(1, "1日から31日の間で選択してください")
		.max(31, "1日から31日の間で選択してください"),
});

export const uploadSchema = baseSchema.extend({
	file: z
		.any()
		.refine((files) => files && files.length > 0, {
			message: "ファイルを選択してください",
		})
		.refine(
			(files) => {
				if (!files || files.length === 0) return false;
				return ["application/pdf"].includes(files[0].type);
			},
			{
				message: "PDFファイルのみアップロード可能です",
			},
		),
});

export const editSchema = baseSchema.extend({
	file: z.any().refine(
		(files) => {
			if (!files || files.length === 0) return true;
			return ["application/pdf"].includes(files[0].type);
		},
		{
			message: "PDFファイルのみアップロード可能です",
		},
	),
});
