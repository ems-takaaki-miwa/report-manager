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
```
pnpm run format
```