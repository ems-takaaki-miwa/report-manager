import { Link, redirect  } from "react-router";
import { useRef } from "react";
import SearchDialog from "./searchDialog";
import { hono } from "~/lib/hono";
import { SESSION_ID_HEADER } from "../../../constants";

export async function clientLoader() {
	// ここでログインしてる場合は右側の要素を表示する
	const user = localStorage.getItem("user");
	console.log("user");
	console.log(user);
	if (user) {
		return {
			user: JSON.parse(user),
		};
	}
}

export default function Header() {
	const dialog = useRef<HTMLDialogElement | null>(null);

	const handleSearchClick = () => {
		dialog.current?.showModal();
	};

	const handleLogoutClick = async () => {
		try {
			await fetch("http://127.0.0.1:8787/api/auth/logout", {
				method: "POST",
				headers: {
					SESSION_ID_HEADER: localStorage.getItem("sessionId") || "",
				},
			});
			console.log("ログアウトしました");
			// await hono.api.auth.logout.$post();
			localStorage.removeItem("user");
			redirect("/login");
		} catch (error) {
			console.error("ログアウトに失敗しました:", error);
		}
	};

	return (
		<div className="navbar shadow-sm">
			<div className="flex-1">
				<Link to="/" className="btn btn-ghost text-xl">
					レポート管理
				</Link>
			</div>
			<div className="flex gap-2">
				<button
					className="btn btn-ghost btn-circle"
					onClick={handleSearchClick}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
				<SearchDialog ref={dialog} />
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn btn-ghost">
						<span>ユーザー名</span>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li>
							<button onClick={handleLogoutClick}>ログアウト</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
