import { Outlet } from "react-router";
import Footer from "../components/footer";
import { Header } from "../components/header";

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow flex justify-center">
				<main className="w-full sm:w-4/5">
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
}
