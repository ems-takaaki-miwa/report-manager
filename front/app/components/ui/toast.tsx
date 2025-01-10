import { useAtom } from "jotai";
import { toastAtom } from "~/atoms";

export const Toast = () => {
	const [toast, setToast] = useAtom(toastAtom);
	return (
		<>
			{toast.isOpen && (
				<div className="toast">
					<div
						className={`${
							toast.variant === "success"
								? "alert-success"
								: toast.variant === "error"
									? "alert-error"
									: toast.variant === "warning"
										? "alert-warning"
										: toast.variant === "info"
											? "alerrt-info"
											: ""
						} alert`}
					>
						<span>{toast.message}</span>
					</div>
				</div>
			)}
		</>
	);
};
