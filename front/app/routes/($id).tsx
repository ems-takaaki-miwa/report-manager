import type { Route } from "./+types/($id)";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    // pdfファイルを取得する
    // ファイルを取得できない場合も0を返す
	return params.id ? parseInt(params.id) : 0;
}

export default function File({ loaderData }: Route.ComponentProps) {
	const id = loaderData;
    // idが0の場合はリダイレクトか、不正なことを示す描画をする
	return (
		<div>
			<p>{id}</p>
		</div>
	);
}
