# Winclean.ReportManager
- front: react-routerのspa
- api: honoのバックエンド
## フロント
react-routerのフレームワークで作っています。
### getting started
```
cd front
pnpm run dev
```
## バックエンド
hono + Drizzle + D1で作っています。
### getting started
```
cd api
# local
pnpm run dev

# 実際のデータベース、KVを使う場合
pnpm run preview
```
## その他
### コードフォーマット
Biomeを使っています。
```bash
pnpm run format
```
### スキーマから型を定義する
```ts
type User = z.infer<typeof userSelectSchema>;
```
参考: https://zod.dev/?id=type-inference
### チームメンバーの権限
Cloudflare Workers Adminでworkers, pages, KV, D1, R2の編集、デプロイ権限がつく

### Todo
- formのバリデーション
- 実際にapiを実行する
- 管理画面、ファイルアップロード画面
- 全てpostにする
- 月の選択、遷移は、formを使い、中に見えないinputを書いて、そこで引数として月と年を渡す手段もありかもしれない。
- 400のバッドリクエストをハンドリングする。