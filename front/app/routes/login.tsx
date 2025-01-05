import React, { useState } from "react";

const Login = () => {
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		// ログイン処理をここに追加
		console.log("User ID:", userId);
		console.log("Password:", password);

		// 例: APIリクエストを送信
		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, password }),
			});

			if (response.ok) {
				// ログイン成功時の処理
				console.log("Login successful");
			} else {
				// ログイン失敗時の処理
				console.error("Login failed");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-full">
			<form onSubmit={handleSubmit}>
				<fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
					<legend className="fieldset-legend">ログイン</legend>
					<label className="fieldset-label">User ID</label>
					<input className="input validator" placeholder="User ID" required />
					<div className="validator-hint hidden">入力してください</div>

					<label className="fieldset-label">Password</label>
					<input
						type="password"
						className="input validator"
						placeholder="Password"
						required
					/>
					<div className="validator-hint hidden">入力してください</div>

					<button type="submit" className="btn btn-neutral mt-4">
						Login
					</button>
				</fieldset>
			</form>
		</div>
	);
};

export default Login;
