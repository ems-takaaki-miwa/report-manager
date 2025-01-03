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

### timestamp
D1(sqlite)にはDate型がなく、スキーマではtimestampを設定している。
実際にDBに保存される値もintegerだが、わざわざ変換せずとも、
Date型を渡すと自動で変換してくれる。drizzleでwhere句で検索するときも変換は不要。
ただ、タイムゾーンが違いそうなので、正しい日付を扱うには変換が必要。
`coerce`は使わない？