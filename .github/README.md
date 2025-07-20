# GitHub Actions 工作流说明

本项目使用 GitHub Actions 进行持续集成、部署和自动化管理。

## 🚀 工作流概览

### 1. CI/CD (`ci.yml`)
主要的持续集成工作流，包含以下任务：

- **test-core**: 核心包测试
- **test-shared**: 共享包测试  
- **test-server**: 服务器包测试（包含 PostgreSQL 数据库）
- **test-client**: 客户端包测试（包含 Storybook 构建）
- **test-docs**: 文档包测试
- **integration-test**: 集成测试
- **code-quality**: 代码质量检查
- **security**: 安全扫描
- **coverage**: 测试覆盖率上传

### 2. 部署 (`deploy.yml`)
自动化部署工作流：

- **deploy-docs**: 部署文档到 GitHub Pages
- **deploy-storybook**: 部署 Storybook 到 GitHub Pages
- **build-docker**: 构建和推送 Docker 镜像

### 3. 发布 (`release.yml`)
自动化发布工作流：

- **release**: 发布 npm 包
- **create-release**: 创建 GitHub Release

### 4. PR 检查 (`pr-check.yml`)
Pull Request 质量检查：

- **code-quality**: 代码质量检查
- **coverage-check**: 测试覆盖率检查
- **security-check**: 安全检查
- **build-check**: 构建检查
- **bundle-size**: 包大小检查
- **commit-message**: 提交信息格式检查

### 5. 夜间构建 (`nightly.yml`)
定期维护任务：

- **dependency-update**: 依赖更新检查
- **security-scan**: 安全漏洞扫描
- **performance-benchmark**: 性能基准测试
- **docs-check**: 文档完整性检查
- **migration-check**: 数据库迁移检查

## 🔧 环境变量

### 必需的环境变量

```bash
# NPM 发布
NPM_TOKEN=your_npm_token

# Docker Hub
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# 安全扫描
SNYK_TOKEN=your_snyk_token

# GitHub Pages
GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
```

### 数据库配置

```bash
# 测试数据库
DB_HOST=localhost
DB_PORT=5432
DB_NAME=koa_template_test
DB_USER=postgres
DB_PASSWORD=postgres

# 集成测试数据库
DB_NAME=koa_template_integration

# 夜间测试数据库
DB_NAME=koa_template_nightly
```

## 📊 工作流触发条件

### 自动触发
- **Push 到 main/develop**: 运行 CI/CD
- **Pull Request**: 运行 PR 检查
- **定时任务**: 每天凌晨 2 点运行夜间构建

### 手动触发
- **workflow_dispatch**: 所有工作流都支持手动触发

## 🎯 质量门禁

### 代码质量
- ESLint 检查通过
- TypeScript 类型检查通过
- Prettier 格式化检查通过
- 无 TODO/FIXME/HACK 注释

### 测试要求
- 所有测试通过
- 测试覆盖率 ≥ 80%
- 集成测试通过

### 构建要求
- 所有包构建成功
- 包大小在限制范围内
- 文档构建成功

### 安全要求
- npm audit 无高危漏洞
- Snyk 扫描通过
- 依赖更新检查通过

## 🔄 工作流程

### 开发流程
1. 创建功能分支
2. 开发功能
3. 提交代码（遵循 Conventional Commits）
4. 创建 Pull Request
5. 自动运行 PR 检查
6. 代码审查
7. 合并到 develop 分支

### 发布流程
1. 合并到 main 分支
2. 自动运行 CI/CD
3. 通过后自动发布 npm 包
4. 创建 GitHub Release
5. 部署文档和 Storybook

### 维护流程
1. 夜间自动检查依赖更新
2. 安全漏洞扫描
3. 性能基准测试
4. 文档完整性检查
5. 数据库迁移检查

## 🛠️ 故障排除

### 常见问题

**1. 构建失败**
```bash
# 检查构建日志
# 确保所有依赖正确安装
npm ci
npm run build
```

**2. 测试失败**
```bash
# 检查测试环境
# 确保数据库连接正常
npm run test
```

**3. 部署失败**
```bash
# 检查环境变量
# 确保权限正确
echo $NPM_TOKEN
echo $DOCKER_PASSWORD
```

**4. 安全扫描失败**
```bash
# 更新依赖
npm audit fix
npm update
```

### 调试技巧

1. **查看工作流日志**
   - 在 GitHub 仓库的 Actions 标签页查看详细日志
   - 使用 `act` 工具本地测试工作流

2. **手动触发工作流**
   - 在 Actions 页面点击 "Run workflow"
   - 选择分支和参数

3. **检查环境变量**
   - 在仓库 Settings > Secrets 中检查配置
   - 确保所有必需的 secrets 都已设置

## 📈 监控和报告

### 测试覆盖率
- 自动上传到 Codecov
- 在 PR 中显示覆盖率变化
- 设置覆盖率阈值（80%）

### 性能监控
- 包大小监控
- 构建时间监控
- 运行时性能基准

### 安全监控
- 依赖漏洞扫描
- 代码安全分析
- 自动安全报告

## 🔗 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Dependabot 文档](https://docs.github.com/en/code-security/dependabot)
- [Changesets 文档](https://github.com/changesets/changesets)
- [Codecov 文档](https://docs.codecov.io/)

## 🤝 贡献

如需修改工作流配置：

1. 创建功能分支
2. 修改 `.github/workflows/` 下的文件
3. 测试工作流（使用 `act` 或创建测试 PR）
4. 提交 Pull Request
5. 等待审查和合并

---

**注意**: 修改工作流配置需要谨慎，确保不会破坏现有的 CI/CD 流程。 