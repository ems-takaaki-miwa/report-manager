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
hono + Prisma + D1で作っています。（Drizzleに変更予定です。）
### getting started
```
cd api
# local
pnpm run dev

# 実際のデータベース、KVを使う場合
pnpm run preview
```
## tips
### コードフォーマット
Biomeを使っています。
```
pnpm run format
```