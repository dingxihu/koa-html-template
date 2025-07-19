-- 创建数据库（如果不存在）
-- 注意：此命令需要在连接到 postgres 系统数据库时执行
CREATE DATABASE koa_template_db;

-- 连接到新建的数据库
\c koa_template_db;

-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 设置时区
SET timezone = 'Asia/Shanghai';

-- 创建用户（可选，如果你想使用专用的数据库用户）
-- CREATE USER koa_template_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE koa_template_db TO koa_template_user;

-- 显示连接信息
SELECT 'Database setup completed!' as message; 