import { Outlet } from "react-router";

export default function Home() {
	return (
		<div>
			<h1>Home</h1>
			<p>Home page</p>
<Outlet />
		</div>
	);
}
