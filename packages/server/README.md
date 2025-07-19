# Koa HTML Template Server

基于 Koa 的模板引擎服务器，支持 PostgreSQL 数据库。

## 快速开始

### 1. 环境准备

确保你已安装：
- Node.js (>= 14.0.0)
- PostgreSQL (>= 12.0)

### 2. 配置数据库

复制环境变量文件并配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置你的数据库信息：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=koa_template_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 3. 数据库初始化

#### 方法一：自动设置（推荐）
```bash
npm run db:setup
```

#### 方法二：手动设置
```bash
# 1. 测试连接
npm run db:test

# 2. 创建数据库（如果不存在）
npm run db:create

# 3. 运行迁移
npm run db:migrate
```

### 4. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 可用脚本

### 开发脚本
- `npm run dev` - 启动开发服务器（热重载）
- `npm run build` - 构建项目
- `npm start` - 启动生产服务器

### 数据库脚本
- `npm run db:setup` - 自动设置数据库（推荐新用户）
- `npm run db:password` - 设置数据库密码（交互式）
- `npm run db:test` - 测试数据库连接
- `npm run db:disconnect` - 断开数据库连接和管理活动会话
- `npm run db:service` - PostgreSQL 服务管理（启动/停止/重启）
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:create` - 创建数据库
- `npm run db:drop` - 删除数据库
- `npm run db:reset` - 重置数据库（删除+创建+迁移）

### 测试和质量
- `npm test` - 运行测试
- `npm run test:watch` - 监听模式运行测试
- `npm run lint` - 代码检查
- `npm run lint:fix` - 自动修复代码风格

## API 端点

### 模板管理
- `GET /api/templates` - 获取所有模板
- `GET /api/templates/:id` - 根据ID获取模板
- `POST /api/templates` - 创建新模板
- `PUT /api/templates/:id` - 更新模板
- `DELETE /api/templates/:id` - 删除模板

### 模板渲染
- `POST /api/templates/:id/render` - 根据ID渲染模板
- `POST /api/templates/render/:name` - 根据名称渲染模板

### 其他
- `GET /api/templates/:id/renders` - 获取模板渲染历史
- `GET /api/templates/stats/overview` - 获取统计信息
- `GET /health` - 健康检查

## 环境变量说明

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DB_HOST` | localhost | 数据库主机 |
| `DB_PORT` | 5432 | 数据库端口 |
| `DB_NAME` | koa_template_db | 数据库名称 |
| `DB_USER` | postgres | 数据库用户 |
| `DB_PASSWORD` | (空) | 数据库密码 |
| `DB_MAX_CONNECTIONS` | 20 | 最大连接数 |
| `DB_IDLE_TIMEOUT` | 30000 | 空闲超时(ms) |
| `DB_CONNECTION_TIMEOUT` | 2000 | 连接超时(ms) |
| `PORT` | 3000 | 服务器端口 |
| `NODE_ENV` | development | 运行环境 |

## 数据库结构

### templates 表
```sql
CREATE TABLE templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### template_renders 表
```sql
CREATE TABLE template_renders (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  rendered_content TEXT NOT NULL,
  render_data JSONB DEFAULT '{}',
  rendered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 故障排除

### 数据库连接问题
1. 检查 PostgreSQL 服务是否运行: `npm run db:service`
2. 验证 `.env` 文件中的配置: `npm run db:test`
3. 管理数据库连接: `npm run db:disconnect`

### 端口冲突
修改 `.env` 文件中的 `PORT` 值

### 迁移失败
1. 检查数据库权限
2. 手动创建数据库: `npm run db:create`
3. 重新运行迁移: `npm run db:migrate`

### PostgreSQL 服务问题
1. 检查服务状态: `npm run db:service`
2. 启动/重启服务: 在服务管理工具中选择相应操作
3. 查看进程: 在服务管理工具中选择查看进程

## 🔧 数据库管理工具详解

### 连接管理 (`npm run db:disconnect`)
- 查看所有活动的数据库连接
- 终止僵死或无响应的连接
- 检查数据库锁定情况
- 诊断连接性能问题

### 服务管理 (`npm run db:service`)
- 跨平台的 PostgreSQL 服务管理
- 支持 macOS、Linux 和 Windows
- 启动、停止、重启数据库服务
- 查看服务状态和进程信息

### 密码管理 (`npm run db:password`)
- 交互式密码设置
- 支持为现有用户设置密码
- 支持创建新的数据库用户
- 自动更新环境配置文件

### 命令执行 (`npm run db:create`/`npm run db:drop`)
- 使用改进的数据库命令执行脚本
- 正确加载环境变量
- 详细的执行日志和错误诊断
- 安全的密码处理

## 开发指南

### 添加新的迁移
1. 在 `src/database/migrate.ts` 中添加新的迁移对象
2. 运行 `npm run db:migrate`

### 扩展 API
1. 在 `src/routes/` 中添加新的路由文件
2. 在 `src/index.ts` 中注册路由
3. 在 `src/models/` 中添加对应的数据模型

## 许可证

ISC License 