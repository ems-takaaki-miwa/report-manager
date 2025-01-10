import { useAtom } from "jotai";
import { toastAtom } from "~/atoms";
import type { ToastType } from "~/types/toast";

type showToastProps = {
	message: string;
	variant: ToastType;
	duration?: number;
};

export const useToast = () => {
	const [toast, setToast] = useAtom(toastAtom);

	const showToast = ({ message, variant, duration = 3000 }: showToastProps) => {
		setToast({ isOpen: true, message, variant });
		setTimeout(() => {
			setToast({ isOpen: false, message, variant });
		}, duration);
	};

	return { showToast };
};
