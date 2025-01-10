export type ToastType = "success" | "error" | "warning" | "info";
export type Toast = {
	isOpen: boolean;
	message: string;
	variant: ToastType;
};
