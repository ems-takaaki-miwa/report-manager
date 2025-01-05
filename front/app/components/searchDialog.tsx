import { forwardRef } from "react";
const SearchDialog = forwardRef<HTMLDialogElement | null>((_, ref) => {
	return (
		<dialog id="my_modal" className="modal text-base-content w-full" ref={ref}>
			<div className="modal-box w-sm">
      <form className="flex flex-col gap-2">
					<label className="floating-label"><span>From</span>
          <input className="input validator" placeholder="年月日" required />
          </label>
					<div className="validator-hint hidden">入力してください</div>

					<label className="floating-label"><span>From</span>
          <input className="input validator" placeholder="年月日" required />
          </label>
					<div className="validator-hint hidden">入力してください</div>

					<button type="submit" className="btn btn-neutral mt-4">
						Login
					</button>
			</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
});

export default SearchDialog;