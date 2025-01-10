import * as z from "zod";

export const signUpSchema = z.object({
	userId: z
		.string()
		.min(1, "ユーザーIDは必須です")
		.max(20, "ユーザーIDは20文字以内で入力してください"),
	name: z
		.string()
		.min(1, "名前は必須です")
		.max(50, "名前は50文字以内で入力してください"),
	password: z
		.string()
		.min(8, "パスワードは8文字以上で入力してください")
		.max(20, "パスワードは20文字以内で入力してください"),
	role: z.enum(["user", "admin"], {
		required_error: "権限は必須です",
	}),
});
