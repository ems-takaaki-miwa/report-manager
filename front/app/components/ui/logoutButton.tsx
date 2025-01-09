import { useAtom } from "jotai/react";
import { useNavigate } from "react-router";
import { userAtom } from "~/atoms";
import { hono } from "~/lib/hono";

export const LogoutButton: React.FC = () => {
	const navigate = useNavigate();
	const [user, setUser] = useAtom(userAtom);

	const handleLogoutClick = async () => {
		if (!user) {
			console.error("ユーザー情報がありません");
			return;
		}
		try {
			await hono.api.auth.logout.$post(
				{},
				{
					headers: {
						"Session-Id": user?.sessionId || "",
					},
				},
			);
			console.log("ログアウトしました");
			setUser(null);

			navigate("/login");
		} catch (error) {
			console.error("ログアウトに失敗しました:", error);
		}
	};

	return (
		<button type="button" onClick={handleLogoutClick}>
			ログアウト
		</button>
	);
};
