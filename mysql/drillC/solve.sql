use drill;

-- 1.
\! echo 1.
select ID, 名称, 職業コード, HP, MP, 状態コード from パーティー;

-- 2.
\! echo 2.
select 名称 as なまえ, HP as 現在のHP, MP as 現在のMP from パーティー;

-- 3.
\! echo 3.
select * from イベント;

-- 4.
\! echo 4.
select イベント番号 as 番号, イベント名称 as 場面 from イベント;

-- 5.
\! echo 5.
insert into パーティー values ('A01', 'スガワラ', 21, 131, 232, '00');
insert into パーティー values ('A02', 'オーエ', 10, 156, 84, '00');
insert into パーティー values ('A03', 'イズミ', 20, 84, 190, '00');

-- 6.
\! echo 6.
select * from パーティー where id = 'C02';

-- 7.
\! echo 7.
UPDATE パーティー SET HP = 120 where id = 'A01';

-- 8.
\! echo 8.
select ID, 名称, HP from パーティー where HP < 100;

-- 9.
\! echo 9.
select ID, 名称, MP from パーティー where MP >= 100;


-- 10.
\! echo 10.
select イベント番号, イベント名称, タイプ from イベント where タイプ <> 3;

-- 11.
\! echo 11.
select イベント番号, イベント名称 from イベント where イベント番号 <= 5;

-- 12.
\! echo 12.
select イベント番号, イベント名称 from イベント where イベント番号 > 5;


-- 13.
\! echo 13.
select イベント番号, イベント名称 from イベント where 前提イベント番号 IS NULL;

-- 14.
\! echo 14.
select イベント番号, イベント名称, 後続イベント番号 from イベント where 後続イベント番号 IS NOT NULL;

-- 15.
\! echo 15.
UPDATE パーティー SET 状態コード = '01' where 名称 LIE '%ミ%';

-- 16.
\! echo 16.
select ID, 名称, HP from パーティー where HP BETWEEN 120 and 160;

-- 17.
\! echo 17.
select 名称, 職業コード from パーティー where 職業コード in ('01', '10', '11');

-- 18.
\! echo 18.
select 名称, 状態コード from パーティー where 状態コード not in ('00', '09');

-- 19.
\! echo 19.
select * from パーティー where HP > 100 and MP > 100;

-- 20.
\! echo 20.
select * from パーティー where ID LIKE 'A%' and 職業コード LIKE '2%';

-- 21.
\! echo 21.
select * from イベント where タイプ = '1' and 前提イベント番号 IS NOT NULL and 後続イベント番号 is not null;

-- 22.
\! echo 22.
-- パーティー: ID
-- イベント: イベント番号

-- 23.
\! echo 23.
select distinct 状態コード from パーティー;

-- 24.
\! echo 24.
select ID, 名称 from パーティー order by ID asc;

-- 25.
\! echo 25.
select 名称, 職業コード from パーティー order by 名称 desc;


-- 26.
\! echo 26.
select 名称, HP, 状態コード from パーティー order by 状態コード asc, HP desc;

-- 27.
\! echo 27.
select タイプ, イベント番号, イベント名称, 前提イベント番号, 後続イベント番号 from イベント order by 1 asc, 2 asc;

-- 28.
\! echo 28.
select * from パーティー order by HP desc LIMIT 3;

-- 29.
\! echo 29.
select * from パーティー order by MP desc LIMIT 1 OFFSET 2;

-- 30.
\! echo 30.
select CASE WHEN 職業コード LIKE '1%' THEN 'S' WHEN 職業コード LIKE '2%' THEN 'M' ELSE 'A' END AS 職業区分 , 職業コード, ID, 名称 from パーティー order by 職業コード desc;

-- 31.
\! echo 31.
SELECT イベント.イベント番号 FROM イベント WHERE イベント番号 NOT IN (SELECT 経験イベント.イベント番号 FROM 経験イベント);

-- 32.
\! echo 32.
\! echo No Answer.
\! echo


-- 33.
\! echo 33.
select 名称 as なまえ, HP as 現在のHP, case when 職業コード LIKE '1%' then HP + 50 else HP END as 装備後のHP from パーティー;

-- 34.
\! echo 34.
UPDATE パーティー set MP = MP + 20 where ID = 'A01' or ID = 'A03';

-- 35.
\! echo 35.
select 名称 as なまえ, HP as 現在のHP, HP * 2 as 予想されるダメージ from パーティー where 職業コード = '11';

-- 36.
\! echo 36.
select 名称 as なまえ, CONCAT(HP,'/', MP) as HPとMP, case
when 状態コード = '01' then '眠り'
when 状態コード = '02' then '毒'
when 状態コード = '03' then '沈黙'
when 状態コード = '04' then '混乱'
when 状態コード = '09' then '気絶'
else NULL
end as ステータス
from パーティー;

-- 37.
\! echo 37.
select イベント番号, イベント名称, case
	when タイプ = '1' then '強制'
	when タイプ = '2' then 'フリー'
	when タイプ = '3' then '特殊'
end as タイプ,
case
	when イベント番号 BETWEEN 1 and 10 then '序盤'
	when イベント番号 BETWEEN 11 and 17 then '中盤'
	else'終盤'
end as 発生時期
from イベント;

-- 38.
\! echo 38.
select 名称 as なまえ, HP as 現在のHP, CHAR_LENGTH(名称) * 10 as 予想ダメージ from パーティー;

-- 39.
\! echo 39.
update パーティー set 状態コード = '04' where HP % 4 = 0 or MP % 4 = 0;

-- 40.
\! echo 40.
select truncate(777 * 0.7, 0);

-- 41.
\! echo 41.
UPDATE パーティー set HP = ROUND(HP * 1.3, 0), MP = ROUND(MP * 1.3, 0);

-- 42.
\! echo 42.
select 名称 as なまえ, HP, POW(HP, 0) as 攻撃1回目, POW(HP, 1) as 攻撃2回目, POW(HP, 2) as 攻撃3回目 from パーティー;

-- 43.
\! echo 43.
select 名称 as なまえ, HP, 状態コード, CAST(状態コード as signed) + case
	when HP <= 50 then 3
	when HP >= 51 and HP <= 100 then 2
	when HP >= 101 and HP <= 150 then 1
	else 0
	end as リスク値
from パーティー
order by リスク値 desc, HP;

-- 44.
\! echo 44.
select case
	when 前提イベント番号 is null then '前提なし'
	else 前提イベント番号
end as 前提イベント番号,
イベント番号,
case
	when 後続イベント番号 is null then '後続なし'
	else 後続イベント番号
end 後続イベント番号
from イベント;

-- 45.
\! echo 45.
select MAX(HP), MAX(MP), MIN(HP), MIN(MP),AVG(HP), AVG(MP) from パーティー;

-- 46.
\! echo 46.
select case
	when タイプ = '1' then '強制'
	when タイプ = '2' then 'フリー'
	when タイプ = '3' then '特殊'
end as タイプ
, COUNT(*) from イベント group by タイプ;

-- 47.
\! echo 47.
select クリア結果, COUNT(*) from 経験イベント group by クリア結果 order by クリア結果 asc;

-- 48.
\! echo 48.
select case
	when SUM(MP) < 500 then '敵は見とれている！'
	when SUM(MP) >= 500 and SUM(MP) < 1000 then '敵は呆然としている！'
	when SUM(MP) >= 1000 then '敵はひれ伏している！'
end as 敵の行動
from パーティー;

-- 49.
\! echo 49.
select case
	when クリア区分 = '0' then '参加したがクリアしていない'
	when クリア区分 = '1' then 'クリアした'
end as 区分,
COUNT(*)
from 経験イベント
group by クリア区分;

-- 50.
\! echo 50.
select case
	when 職業コード LIKE '1%' then 'S'
	when 職業コード LIKE '2%' then 'M'
	else 'A'
end as 職業タイプ,
MAX(HP), MAX(MP), MIN(HP), MIN(MP), AVG(HP), AVG(MP)
from パーティー
group by case
	when 職業コード LIKE '1%' then 'S'
	when 職業コード LIKE '2%' then 'M'
	else 'A'
end;

-- 51.
\! echo 51.
select case
when ID LIKE 'A%' then 'A'
when ID LIKE 'C%' then 'C'
else 'Z'
end as IDによる分類, AVG(HP) as HPの平均, AVG(MP) as MPの平均 from パーティー group by case
when ID LIKE 'A%' then 'A'
when ID LIKE 'C%' then 'C'
else 'Z'
end
HAVING AVG(HP) > 100;

-- 52.
\! echo 52.
select SUM(
	case when HP < 100 then 1
		 when HP >= 100 and HP < 150 then 2
		 when HP >= 150 and HP < 200 then 3
		 when HP >= 200 then 5
	end
) as 開けることのできる扉の枚数 from パーティー;

-- 53.
\! echo 53.
select 名称 as なまえ, HP as 現在のHP, ROUND(HP / (select SUM(HP) from パーティー) * 100, 1) as パーティーでの割合 from パーティー;

-- 54.
\! echo 54.
select (select SUM(MP) from パーティー where 職業コード <> '20' ) * 0.1 as 回復するMP from パーティー where 職業コード = '20';
-- update パーティー set MP = (select SUM(MP) from パーティー where 職業コード <> '20' ) * 0.1 where 職業コード = '20';

-- 55.
\! echo 55.
select イベント番号, クリア結果 from 経験イベント where クリア結果 IS NOT NULL and イベント番号 IN (select イベント番号 from イベント where タイプ IN ('1', '3'));

-- 56.
\! echo 56.
select 名称, MP from パーティー where MP = (select MAX(MP) from パーティー);

-- 57.
\! echo 57.
select イベント番号, イベント名称 from イベント where イベント番号 NOT IN (select イベント番号 from 経験イベント) order by イベント番号;

-- 58.
\! echo 58.
select COUNT(*) from イベント where イベント番号 NOT IN (select イベント番号 from 経験イベント);

-- 59.
\! echo 59.
select イベント番号, イベント名称 from イベント where イベント番号 < (select イベント番号 from 経験イベント where ルート番号 = 5);

-- 60.
\! echo 60.
select イベント番号, イベント名称, 前提イベント番号 from イベント where 前提イベント番号 IN (select イベント番号 from 経験イベント where クリア結果 IS NOT NULL);

-- 61.
\! echo 61.
UPDATE 経験イベント SET クリア区分 = '1', クリア結果 = 'B' where イベント番号 = 9;
INSERT INTO 経験イベント (イベント番号 , クリア区分, ルート番号) values ((select 後続イベント番号 from イベント where イベント番号 = 9), 0, (select MAX(SUB.ルート番号) from (select * from 経験イベント) as SUB));

-- 62.
\! echo 62.
select ルート番号, イベント.イベント番号, イベント名称, クリア結果 from イベント JOIN 経験イベント ON イベント.イベント番号 = 経験イベント.イベント番号;

-- 63.
\! echo 63.
select イベント.イベント番号, イベント名称, クリア結果 from イベント JOIN 経験イベント ON イベント.イベント番号 = 経験イベント.イベント番号 where イベント.タイプ = '1';

-- 64.
\! echo 64.
select イベント.イベント番号, イベント名称, case when クリア区分 IS NULL then '未クリア' else クリア区分 end as クリア区分 from イベント left JOIN 経験イベント ON イベント.イベント番号 = 経験イベント.イベント番号 where イベント.タイプ = '1';


-- 65.
\! echo 65.
select ID, 名称 as なまえ, コード値 from パーティー JOIN コード;

-- 66.
\! echo 66.


-- 67.
\! echo 67.


-- 68.
\! echo 68.


-- 69.
\! echo 69.


-- 70.
\! echo 70.


