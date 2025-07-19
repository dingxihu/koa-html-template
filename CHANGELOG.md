# 更新日志

## [2.0.0] - 2024-07-19

### 🆕 重大更新 - Monorepo 架构

#### ✨ 新增功能

**Monorepo 架构**
- 🏗️ 采用 npm workspaces 的 monorepo 结构
- 📦 拆分为 5 个独立的包：core、server、client、shared、docs
- 🔧 统一的构建、测试和发布流程
- 📈 支持增量构建和并行开发

**数据库集成**
- 🐘 PostgreSQL 数据库支持
- 📊 完整的数据库迁移系统
- 🗄️ 模板存储和管理
- 📈 模板渲染历史记录
- 🔍 数据库统计和监控

**数据库管理工具**
- 🔐 交互式密码设置工具 (`npm run db:password`)
- 🔌 数据库连接管理工具 (`npm run db:disconnect`)
- 🐘 PostgreSQL 服务管理工具 (`npm run db:service`)
- 🧪 数据库连接测试工具 (`npm run db:test`)
- 🏗️ 一键数据库设置 (`npm run db:setup`)

**RESTful API**
- 🌐 完整的模板管理 API
- 🔄 模板渲染服务
- 📊 渲染历史查询
- 📈 统计信息接口
- ❤️ 健康检查端点

**模板语法增强**
- ✅ 支持条件渲染 (`{if condition}...{/if}`)
- 🔄 支持循环渲染 (`{for array}...{/for}`)
- 📝 支持文件包含 (`{-include "file.html"}`)
- 💬 支持模板注释 (`{# comment #}`)
- 🛡️ HTML 自动转义和原始输出

**TypeScript 完全支持**
- 📝 所有包都有完整的 TypeScript 类型定义
- 🔒 严格的类型检查
- 🧩 项目引用和路径映射
- 📚 类型安全的 API 接口

**开发工具增强**
- 📖 VitePress 文档站点
- 🧪 Jest 测试框架
- 🔍 ESLint + Prettier 代码质量
- 🔄 Changesets 版本管理
- 🤖 GitHub Actions CI/CD

#### 🐛 修复问题

**构建系统**
- ✅ 修复 Rollup ESM/CommonJS 兼容性问题
- ✅ 修复 workspace 依赖解析问题
- ✅ 修复 TypeScript 项目引用配置
- ✅ 修复 VitePress ESM 模块加载问题

**类型安全**
- ✅ 修复核心包中的 TypeScript 严格检查错误
- ✅ 修复可选属性类型问题
- ✅ 修复模板引擎中的空值检查
- ✅ 修复服务器包中的类型依赖问题

**数据库连接**
- ✅ 修复环境变量加载问题
- ✅ 修复数据库命令执行错误
- ✅ 修复连接超时和错误处理
- ✅ 修复密码安全存储

#### 🔄 重构改进

**代码结构**
- 🏗️ 重构为模块化的 monorepo 架构
- 📦 分离核心逻辑和应用逻辑
- 🔧 统一的构建和测试配置
- 📝 改进的错误处理和日志记录

**性能优化**
- ⚡ 改进的模板缓存机制
- 🗄️ 高效的数据库连接池
- 📈 渲染性能统计
- 🔄 并行构建支持

**开发体验**
- 🛠️ 完整的开发工具链
- 📚 详细的文档和示例
- 🧪 全面的测试覆盖
- 🔧 丰富的调试工具

#### 📚 文档更新

- 📖 全新的项目文档结构
- 🎯 详细的快速开始指南
- 📊 完整的 API 参考文档
- 🎨 丰富的使用示例
- 🔧 详细的故障排除指南

#### 🔧 开发工具

**新增脚本**
```bash
# 构建脚本
npm run build              # 构建所有包
npm run build:core         # 构建核心包
npm run build:server       # 构建服务器包
npm run build:client       # 构建客户端包
npm run build:shared       # 构建共享包

# 数据库脚本
npm run db:setup           # 一键数据库设置
npm run db:password        # 设置数据库密码
npm run db:test            # 测试数据库连接
npm run db:disconnect      # 管理数据库连接
npm run db:service         # PostgreSQL 服务管理
npm run db:create          # 创建数据库
npm run db:drop            # 删除数据库
npm run db:migrate         # 运行迁移
npm run db:reset           # 重置数据库

# 开发脚本
npm run dev                # 启动所有开发服务
npm run dev:server         # 启动服务器
npm run dev:client         # 启动客户端
npm run dev:docs           # 启动文档站点

# 质量保证
npm run test               # 运行所有测试
npm run test:coverage      # 测试覆盖率
npm run lint               # 代码检查
npm run lint:fix           # 自动修复代码风格
```

#### 🏃‍♂️ 迁移指南

**从 v1.x 升级到 v2.0**

1. **安装新版本**
   ```bash
   npm install @koa-html-template/core@^2.0.0
   ```

2. **更新导入语句**
   ```typescript
   // v1.x
   import koaHtmlTemplate from 'koa-html-template'
   
   // v2.0
   import koaHtmlTemplate from '@koa-html-template/core'
   ```

3. **数据库设置（可选）**
   ```bash
   # 如果需要使用服务器包
   npm install @koa-html-template/server
   cd node_modules/@koa-html-template/server
   npm run db:setup
   ```

#### ⚠️ 破坏性变更

- 📦 包名从 `koa-html-template` 更改为 `@koa-html-template/core`
- 🏗️ 项目结构完全重构为 monorepo
- 📝 某些内部 API 接口有变化
- 🔧 配置选项和默认值可能有调整

#### 🙏 致谢

感谢所有对 v2.0 开发做出贡献的开发者和用户！

---

## [1.x.x] - 历史版本

详见 [v1.x 分支](https://github.com/dingxihu/koa-html-template/tree/v1.x) 的更新记录。 