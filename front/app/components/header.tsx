import { useAtom } from "jotai/react";
import { useRef } from "react";
import { Link } from "react-router";
import { userAtom } from "~/atoms";
import { useUploadReport } from "~/hooks/useUploadReport";
import { ReportFormModal } from "./reportFormModal";
import { LogoutButton } from "./ui/logoutButton";

export const Header: React.FC = () => {
	const [user, setUser] = useAtom(userAtom);
	const reportFormModalRef = useRef<HTMLDialogElement | null>(null);
	const { mutate, isPending } = useUploadReport({
		ref: reportFormModalRef,
	});

	return (
		<div className="navbar shadow-sm">
			<div className="flex-1">
				<Link to="/" className="btn btn-ghost text-xl">
					レポート管理
				</Link>
			</div>
			{user && (
				<div className="flex gap-2">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => reportFormModalRef.current?.showModal()}
					>
						アップロード
					</button>
					<ReportFormModal
						ref={reportFormModalRef}
						usecase="upload"
						submitAction={mutate}
						isLoading={isPending}
					/>
					<div className="dropdown dropdown-end">
						<button type="button" tabIndex={0} className="btn btn-ghost">
							<span>{user.name}</span>
						</button>
						<ul className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
							<li>
								<LogoutButton />
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};
