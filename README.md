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
- ファイルデータの型を修正（年月日を一緒にする？）
- ログインしてない場合はファイル一覧を見れないようにする
- [react Hook Form](https://react-hook-form.com/)か[react-routerのfetcher](https://reactrouter.com/how-to/fetchers)を使う
  - fetcherを使う場合は[これ](https://reactrouter.com/how-to/form-validation)が参考になりそう