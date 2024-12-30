export interface Bindings {
	// 環境変数や外部サービスのバインディングを定義する
	DB: D1Database;
	MY_KV: KVNamespace;
	USERNAME: string;
	PASSWORD: string;
}
