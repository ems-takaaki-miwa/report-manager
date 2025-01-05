import React from "react";

interface FileCardProps {
	title: string;
	fileDate: string;
}
const FileCard: React.FC<FileCardProps> = ({ title, fileDate }) => {
	return (
		<div className="card bg-base-100 w-48 shadow-xl">
			<div className="card-body p-4">
				<h2 className="card-title">{title}</h2>
				<p className="text-xs">{fileDate}</p>
				<div className="card-actions justify-end">
					<button className="btn btn-primary btn-sm">ダウンロード</button>
				</div>
			</div>
		</div>
	);
};
export default FileCard;
