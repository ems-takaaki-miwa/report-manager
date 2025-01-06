import React from "react";
import { hono } from "~/lib/hono";
import { redirect, useFetcher } from "react-router";
import { Alert } from "~/components/ui/alert";
import type { Route } from "./+types/login";

export async function clientLoader() {
	// ここでログインしてる場合は右側の要素を表示する
	const user = localStorage.getItem("user");
	if (user) {
		return redirect("/");
	}
}

export async function clientAction({ request }: Route.ActionArgs) {
	// ログイン処理をここに追加
	await new Promise((res) => setTimeout(res, 1000));
	let data = await request.formData();
	try {
		const response = await hono.api.auth.login.$post({
			json: {
				userId: data.get("userId") as string,
				password: data.get("password") as string,
			},
		});

		if (response.ok) {
			// ログイン成功時にユーザー情報をローカルストレージに保存
			const data = await response.json();
			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("sessionId", data.sessionId);
			console.log("true");
			return redirect("/");
		} else {
			// ログイン失敗時の処理
			console.error("Login failed");
			return { ok: false, error: "ログインに失敗しました" };
		}
	} catch (error) {
		console.error("Error:", error);
		return { ok: false, error: "ログインに失敗しました" };
	}
}

const Login: React.FC = () => {
	let fetcher = useFetcher();

	return (
		<div className="flex flex-col items-center justify-center min-h-full">
			<fetcher.Form method="post">
				<fieldset className="fieldset w-xs border border-base-300 p-4 rounded-box shadow-sm">
					<legend className="fieldset-legend">ログイン</legend>
					{fetcher.data?.error && (
						<Alert message={fetcher.data.error} isVisible={true} />
					)}
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

					<button type="submit" className="btn btn-primary mt-4">
					{fetcher.state !== "idle" ? <span className="loading loading-spinner loading-md"></span>: "ログイン"}
					</button>
				</fieldset>
			</fetcher.Form>
		</div>
	);
};

export default Login;
