import { useFormStatus } from "react-dom";

export const LoginButton: React.FC = () => {
	const { pending } = useFormStatus();
	return (
		<button type="submit" className="btn btn-primary mt-4" disabled={pending}>
			{pending ? (
				<span className="loading loading-spinner loading-md"></span>
			) : (
				"ログイン"
			)}
		</button>
	);
};
