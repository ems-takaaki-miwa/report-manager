import React from "react";
import { hono } from "~/lib/hono";
import { useNavigate, redirect } from "react-router";
import { Alert } from "~/components/ui/alert";
import { LoginButton } from "~/components/ui/loginButton";
import { useAtom } from "jotai/react";
import { userAtom } from "~/atoms";

export async function clientLoader() {
	// ここでログインしてるかをチェックする
	// ログインしていない場合はリダイレクトする
	const user = localStorage.getItem("user");
	console.log(user);
	if (user != null && user != "null") {
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
		<div className="flex flex-col items-center justify-center min-h-full">
			<form action={login}>
				<fieldset className="fieldset w-xs border border-base-300 p-4 rounded-box shadow-sm">
					<legend className="fieldset-legend">ログイン</legend>
					{/* {fetcher.data?.error && (
						<Alert message={fetcher.data.error} isVisible={true} />
					)} */}
					<label className="fieldset-label">User ID</label>
					<input
						name="userId"
						className="input validator"
						placeholder="User ID"
						required
					/>
					<div className="validator-hint hidden">入力してください</div>

					<label className="fieldset-label">Password</label>
					<input
						name="password"
						type="password"
						className="input validator"
						placeholder="Password"
						required
					/>
					<div className="validator-hint hidden">入力してください</div>

					<LoginButton />
				</fieldset>
			</form>
		</div>
	);
};

export default Login;
