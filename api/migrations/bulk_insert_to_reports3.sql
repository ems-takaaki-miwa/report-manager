WITH RECURSIVE months(month) AS (
  VALUES(1)
  UNION ALL
  SELECT month + 1 FROM months WHERE month < 12
)
INSERT INTO reports (type, title, day, month, year, uploaderId, createdAt, updatedAt)
SELECT 
  'monthly' as type,
  CASE (ABS(RANDOM()) % 5)
    WHEN 0 THEN '月次売上集計レポート'
    WHEN 1 THEN '月間プロジェクト進捗報告'
    WHEN 2 THEN '月次経費精算書'
    WHEN 3 THEN '月間業績評価シート'
    ELSE '月次在庫管理状況'
  END as title,
  1 as day,
  month,
  strftime('%Y', 'now') as year,
  CASE (ABS(RANDOM()) % 3)
    WHEN 0 THEN 'test'
    WHEN 1 THEN 'test'
    ELSE 'test'
  END as uploaderId,
  unixepoch() as createdAt,
  unixepoch() as updatedAt
FROM months;
