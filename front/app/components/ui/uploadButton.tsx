import { useFormStatus } from "react-dom";

export const UploadButton: React.FC = () => {
	const { pending } = useFormStatus();
	return (
		<button type="submit" className="btn btn-primary mt-4" disabled={pending}>
			{pending ? (
				<span className="loading loading-spinner loading-md" />
			) : (
				"アップロード"
			)}
		</button>
	);
};
