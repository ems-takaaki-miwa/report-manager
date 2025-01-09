import { useFormStatus } from "react-dom";

interface UploadButtonProps {
	disabled?: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ disabled }) => {
	const { pending } = useFormStatus();
	const isDisabled = disabled || pending;

	return (
		<button
			type="submit"
			className="btn btn-primary mt-4"
			disabled={isDisabled}
		>
			{isDisabled ? (
				<span className="loading loading-spinner loading-md" />
			) : (
				"アップロード"
			)}
		</button>
	);
};
