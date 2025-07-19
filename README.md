# Koa HTML Template Monorepo

**🆕 v2.0 - 现已支持 TypeScript 和 Monorepo 架构!**

这是一个基于 Koa 的高性能模板引擎，采用现代化的 Monorepo 架构，完全支持 TypeScript，提供核心引擎、服务器应用、客户端组件和共享工具包。

## 🏗️ Monorepo 架构

```
koa-html-template/
├── packages/
│   ├── core/          # 核心模板引擎
│   ├── server/        # Koa 服务器应用
│   ├── client/        # React 客户端组件库
│   ├── shared/        # 共享类型和工具
│   └── docs/          # 文档和示例
├── README.md          # 项目主文档
└── package.json       # Monorepo 根配置
```

## 📦 包说明

### [@koa-html-template/core](./packages/core)
核心模板引擎，提供模板解析、渲染和缓存功能。

**特性：**
- ✅ 完整的模板语法支持
- ✅ 高性能缓存系统
- ✅ TypeScript 类型定义
- ✅ 错误处理和调试

### [@koa-html-template/server](./packages/server)
基于 Koa 的服务器应用，集成 PostgreSQL 数据库。

**特性：**
- ✅ RESTful API
- ✅ PostgreSQL 集成
- ✅ 用户认证系统
- ✅ 模板管理功能

### [@koa-html-template/client](./packages/client)
React 客户端组件库，提供模板渲染组件。

**特性：**
- ✅ React Hooks 支持
- ✅ TypeScript 类型安全
- ✅ 响应式设计
- ✅ 组件测试覆盖

### [@koa-html-template/shared](./packages/shared)
共享类型定义、工具函数和常量。

**特性：**
- ✅ 统一的类型系统
- ✅ 通用工具函数
- ✅ API 响应结构
- ✅ 错误代码定义

### [@koa-html-template/docs](./packages/docs)
基于 VitePress 的文档站点。

**特性：**
- ✅ 完整的使用指南
- ✅ API 参考文档
- ✅ 实用示例集合
- ✅ 搜索功能

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 7.0.0
- TypeScript >= 5.0.0

### 安装

```bash
# 克隆项目
git clone https://github.com/dingxihu/koa-html-template.git
cd koa-html-template

# 安装依赖
npm install

# 构建所有包
npm run build

# 开发模式（同时启动服务器、客户端和文档）
npm run dev
```

### 使用核心包

```bash
npm install @koa-html-template/core
```

```typescript
import Koa from 'koa'
import koaHtmlTemplate, { ExtendedContext } from '@koa-html-template/core'

const app = new Koa()

app.use(koaHtmlTemplate('./templates', {
  cache: true,
  debug: process.env.NODE_ENV !== 'production'
}))

app.use(async (ctx: ExtendedContext) => {
  ctx.template('index.html', {
    title: '欢迎使用 Koa HTML Template',
    users: [
      { name: '张三', age: 25 },
      { name: '李四', age: 30 }
    ]
  })
})

app.listen(3000)
```

## 🛠️ 开发指南

### 开发脚本

```bash
# 构建所有包
npm run build

# 分别构建各个包
npm run build:core
npm run build:shared
npm run build:server
npm run build:client

# 运行测试
npm run test

# 代码检查
npm run lint
npm run lint:fix

# 清理构建文件
npm run clean
```

### 开发模式

```bash
# 同时启动服务器、客户端和文档
npm run dev

# 单独启动
npm run dev:server    # 启动服务器（端口 3000）
npm run dev:client    # 启动客户端开发服务器
npm run dev:docs      # 启动文档站点（端口 5173）
```

### 添加新包

1. 在 `packages/` 目录下创建新包
2. 添加 `package.json` 和 `tsconfig.json`
3. 在根 `tsconfig.json` 中添加引用
4. 更新相关依赖关系

## 🧪 测试

每个包都包含完整的测试套件：

```bash
# 运行所有测试
npm run test

# 运行特定包的测试
npm run test --workspace=packages/core
npm run test --workspace=packages/server

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test:coverage
```

## 📚 文档

- **在线文档**: [https://dingxihu.github.io/koa-html-template](https://dingxihu.github.io/koa-html-template)
- **API 参考**: [API 文档](./packages/docs/api/)
- **使用指南**: [指南文档](./packages/docs/guide/)
- **示例集合**: [示例代码](./packages/docs/examples/)

### 本地运行文档

```bash
npm run dev:docs
```

访问 http://localhost:5173 查看文档。

## 🚀 部署

### 生产构建

```bash
# 构建所有包
npm run build

# 启动生产服务器
npm run start:server
```

### Docker 部署

```bash
# 构建镜像
docker build -t koa-html-template .

# 运行容器
docker run -p 3000:3000 koa-html-template
```

## 📈 性能

- **模板缓存**: 自动缓存编译后的模板，显著提升性能
- **增量构建**: Monorepo 支持包级别的增量构建
- **Tree Shaking**: 支持树摇优化，减少打包体积
- **类型优化**: TypeScript 类型系统提供编译时优化

## 🔄 版本管理

项目使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理：

```bash
# 添加变更集
npm run changeset

# 版本更新
npm run version-packages

# 发布包
npm run release
```

## 🛡️ 安全性

- **XSS 防护**: 自动转义 HTML 内容
- **依赖扫描**: 定期扫描安全漏洞
- **类型安全**: TypeScript 提供编译时类型检查
- **输入验证**: 严格的输入验证和错误处理

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 开启 Pull Request

### 提交规范

我们使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加或修改测试
chore: 构建过程或辅助工具的变动
```

### 代码质量

- 所有代码必须通过 ESLint 检查
- 新功能需要添加对应的测试用例
- 保持测试覆盖率在 80% 以上
- 使用 Prettier 格式化代码

## 📄 许可证

[ISC License](LICENSE) © 2024 Jericho

## 🔗 相关链接

- [GitHub Issues](https://github.com/dingxihu/koa-html-template/issues)
- [GitHub Discussions](https://github.com/dingxihu/koa-html-template/discussions)
- [更新日志](CHANGELOG.md)
- [贡献指南](CONTRIBUTING.md)

## ⭐ 支持项目

如果这个项目对你有帮助，请考虑给我们一个星标 ⭐

---

**Happy Coding! 🎉**
