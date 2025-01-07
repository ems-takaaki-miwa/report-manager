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
- ClientLoaderでのエラーハンドリングが難しい
  - クライアントローダーで取得にミスったときにどんな挙動であるべき？
    - 401: 認証していない場合、認証が切れている場合はログイン画面に遷移する
    - 500: サーバー側でエラーが発生した場合はエラー画面に遷移する
      - ここが参考になりそう: https://reactrouter.com/how-to/error-boundary#3-throw-data-in-loadersactions
- 全てpostにする