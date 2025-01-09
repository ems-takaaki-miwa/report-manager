import { useFormStatus } from "react-dom";

interface ReportFormButtonProps {
	isLoading: boolean;
	label: string;
}

export const ReportFormButton: React.FC<ReportFormButtonProps> = ({
	label,
	isLoading,
}) => {
	return (
		<button type="submit" className="btn btn-primary mt-4" disabled={isLoading}>
			{isLoading ? (
				<span className="loading loading-spinner loading-md" />
			) : (
				label
			)}
		</button>
	);
};
