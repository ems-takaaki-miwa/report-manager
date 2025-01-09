import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai/react";
import type React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { redirect, useNavigate } from "react-router";
import * as z from "zod";
import { userAtom } from "~/atoms";
import { Alert } from "~/components/ui/alert";
import { LoginButton } from "~/components/ui/loginButton";
import { useToast } from "~/hooks/use-toast";
import { hono } from "~/lib/hono";
import { getStorageUser } from "~/lib/utils";

const FormSchema = z.object({
	userId: z.string().min(1, "ユーザーIDは必須です"),
	password: z.string().min(1, "パスワードは必須です"),
});

type FormInput = z.infer<typeof FormSchema>;

export async function clientLoader() {
	// ここでログインしてるかをチェックする
	// ログインしていない場合はリダイレクトする
	const user = getStorageUser();
	console.log(user);
	if (user !== null) {
		return redirect("/");
	}
	return null;
}

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [user, setUserAtom] = useAtom(userAtom);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema),
	});
	const { toast } = useToast();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		try {
			const response = await hono.api.auth.login.$post({
				json: {
					userId: data.userId,
					password: data.password,
				},
			});

			if (response.ok) {
				// ログイン成功時にユーザー情報をローカルストレージに保存
				const data = await response.json();
				setUserAtom({
					sessionId: data.sessionId,
					id: data.user.id,
					role: data.user.role,
					name: data.user.name,
				});
				navigate("/");
			} else {
				// ログイン失敗時の処理
				toast({
					variant: "error",
					title: "ログイン失敗",
					description: "ユーザーIDまたはパスワードが間違っています。",
				});
				console.error("Login failed");
			}
		} catch (error) {
			toast({
				variant: "error",
				title: "ログイン失敗",
				description: "ログイン中にサーバーでエラーが発生しました。",
			});
			console.error("Error:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-full w-full">
			<h2 className="text-lg font-bold my-4">ログイン</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full sm:w-96"
			>
				<label
					className={`input w-full ${errors?.userId ? "input-error" : ""}`}
				>
					<span className="label">User ID</span>
					<input {...register("userId", { required: true })} className="" />
					{errors?.userId?.message && (
						<p className="text-error">{errors.userId.message}</p>
					)}
				</label>

				<label
					className={`input w-full ${errors?.password ? "input-error" : ""}`}
				>
					<span className="label">Password</span>
					<input
						{...register("password", { required: true })}
						type="password"
						className=""
					/>
					{errors?.password?.message && (
						<p className="text-error">{errors.password.message}</p>
					)}
				</label>

				<LoginButton />
			</form>
		</div>
	);
};

export default Login;
