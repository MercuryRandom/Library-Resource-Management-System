-- 修改reader表中gender字段的长度
-- 将gender字段从VARCHAR(1)改为VARCHAR(10)以支持中文字符

ALTER TABLE reader MODIFY COLUMN gender VARCHAR(10);

-- 验证修改
DESCRIBE reader; 