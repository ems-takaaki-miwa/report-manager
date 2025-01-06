import { Outlet } from "react-router";
import { Header } from "../components/header";
import Footer from "../components/footer";

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow flex justify-center">
				<main className="p-4">
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
}
