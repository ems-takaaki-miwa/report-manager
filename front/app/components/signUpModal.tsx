import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { useToast } from "~/hooks/useToast";
import { type SinUpProps, signUp } from "~/lib/auth";
import { signUpSchema } from "~/validations/userShema";

type SignUpModalProps = {
	ref: React.RefObject<HTMLDialogElement | null>;
};

export const SignUpModal: React.FC<SignUpModalProps> = ({ ref }) => {
	const { showToast } = useToast();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			userId: "",
			password: "",
			role: "user",
		},
	});
	const mutation = useMutation({
		mutationFn: signUp,
		onSuccess: (data) => {
			showToast({
				message: "ユーザーを作成しました",
				variant: "success",
			});
			reset();
			ref.current?.close();
		},
		onError: (error) => {
			showToast({
				message: error.message,
				variant: "error",
			});
		},
	});

	const onSubmit: SubmitHandler<SinUpProps> = async (data) => {
		mutation.mutate(data);
	};

	return (
		<dialog id="form_dialog" className="modal" ref={ref}>
			<div className="modal-box">
				<h3 className="font-bold text-lg my-4 text-center">ユーザー作成</h3>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full flex flex-col gap-6 sm:p-8 text-left"
				>
					<label className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<span>役割</span>
							<div
								className="tooltip tooltip-right"
								data-tip="ユーザー: 一般権限  /  アドミン: 管理者権限"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="w-4 h-4 stroke-current"
								>
									<title>hint</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
						<div className="space-x-4">
							<input
								id="user"
								type="radio"
								value="user"
								className="radio"
								{...register("role", { required: true })}
							/>
							<label htmlFor="user">ユーザー</label>
							<input
								id="admin"
								type="radio"
								value="admin"
								className="radio"
								{...register("role", { required: true })}
							/>
							<label htmlFor="admin">アドミン</label>
						</div>
						{errors?.role?.message && (
							<p className="text-error">{errors.role.message}</p>
						)}
					</label>
					<label className="flex flex-col gap-2">
						<span>ユーザーID</span>
						<input
							{...register("userId", { required: true })}
							className={`input w-full ${errors?.userId ? "input-error" : ""}`}
						/>
						{errors?.userId?.message && (
							<p className="text-error">{errors.userId.message}</p>
						)}
					</label>
					<label className="flex flex-col gap-2">
						<span>名前</span>
						<input
							{...register("name", { required: true })}
							className={`input w-full ${errors?.name ? "input-error" : ""}`}
						/>
						{errors?.name?.message && (
							<p className="text-error">{errors.name.message}</p>
						)}
					</label>
					<label className="flex flex-col gap-2">
						<span>パスワード</span>
						<input
							{...register("password", { required: true })}
							type="password"
							className={`input w-full ${errors?.password ? "input-error" : ""}`}
						/>
						{errors?.password?.message && (
							<p className="text-error">{errors.password.message}</p>
						)}
					</label>
					<div className="flex gap-4 justify-center mt-4">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? (
								<span className="loading loading-spinner loading-md" />
							) : (
								"送信"
							)}
						</button>
						<button
							type="button"
							className="btn"
							onClick={() => ref.current?.close()}
							disabled={mutation.isPending}
						>
							キャンセル
						</button>
					</div>
				</form>
			</div>
		</dialog>
	);
};
