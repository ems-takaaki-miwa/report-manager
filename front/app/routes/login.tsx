import { useAtom } from "jotai/react";
import type React from "react";
import { redirect, useNavigate } from "react-router";
import { userAtom } from "~/atoms";
import { Alert } from "~/components/ui/alert";
import { LoginButton } from "~/components/ui/loginButton";
import { hono } from "~/lib/hono";

export async function clientLoader() {
	// ここでログインしてるかをチェックする
	// ログインしていない場合はリダイレクトする
	const user = localStorage.getItem("user");
	console.log(user);
	if (user != null && user !== "null") {
		return redirect("/");
	}
	return null;
}

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [user, setUserAtom] = useAtom(userAtom);

	async function login(formData: FormData) {
		const userId = await formData.get("userId");
		const password = await formData.get("password");
		// ログイン処理をここに追加
		await new Promise((res) => setTimeout(res, 1000));
		try {
			const response = await hono.api.auth.login.$post({
				json: {
					userId: userId as string,
					password: password as string,
				},
			});

			if (response.ok) {
				// ログイン成功時にユーザー情報をローカルストレージに保存
				const data = await response.json();
				setUserAtom({
					sessionId: data.sessionId,
					id: data.user.id,
					name: data.user.name,
				});
				navigate("/");
			} else {
				// ログイン失敗時の処理
				console.error("Login failed");
				// return { ok: false, error: "ログインに失敗しました" };
			}
		} catch (error) {
			console.error("Error:", error);
			// return { ok: false, error: "ログインに失敗しました" };
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-full w-full">
			<h2 className="text-lg font-bold my-4">ログイン</h2>
			<form action={login} className="flex flex-col gap-4 w-full sm:w-96">
				<label className="input w-full">
					<span className="label">User ID</span>
					<input name="userId" className="" required />
				</label>

				<label className="input w-full">
					<span className="label">Password</span>
					<input name="password" type="password" className="w-full" required />
				</label>

				<LoginButton />
			</form>
		</div>
	);
};

export default Login;
