CREATE DATABASE study;

USE study;

CREATE TABLE 家計簿 (
	日付 DATE NOT NULL,
	費目 VARCHAR(20),
	メモ VARCHAR(100) DEFAULT '不明' NOT NULL,
	入金額 INTEGER DEFAULT 0 CHECK (入金額 >= 0),
	出金額 INTEGER DEFAULT 0 CHECK (出金額 >= 0)
);

-- 家計簿テーブルと同一スキーマ(面倒なのでコピペ)
CREATE TABLE 家計簿アーカイブ LIKE 家計簿;

CREATE TABLE 家計簿集計 (
	費目 VARCHAR(20),
	合計 INTEGER(10),
	平均 INTEGER(10),
	最大 INTEGER(10),
	最小 INTEGER(10),
	回数 INTEGER(10)
);