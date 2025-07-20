# GitHub Actions 完善总结

## 🎯 完善内容

根据项目的 Monorepo 架构和各个包的特点，我们完善了以下 GitHub Actions 工作流：

## 📋 工作流文件

### 1. `ci.yml` - 主要 CI/CD 工作流
**功能**: 持续集成和测试
**触发**: Push 到 main/develop 分支，Pull Request

**包含任务**:
- ✅ **test-core**: 核心包测试
- ✅ **test-shared**: 共享包测试  
- ✅ **test-server**: 服务器包测试（包含 PostgreSQL 数据库）
- ✅ **test-client**: 客户端包测试（包含 Storybook 构建）
- ✅ **test-docs**: 文档包测试
- ✅ **integration-test**: 集成测试
- ✅ **code-quality**: 代码质量检查
- ✅ **security**: 安全扫描
- ✅ **coverage**: 测试覆盖率上传

**特色**:
- 多包并行测试，提高效率
- PostgreSQL 服务容器化测试
- 完整的代码质量检查
- 自动安全漏洞扫描

### 2. `deploy.yml` - 部署工作流
**功能**: 自动化部署
**触发**: Push 到 main 分支，手动触发

**包含任务**:
- ✅ **deploy-docs**: 部署文档到 GitHub Pages
- ✅ **deploy-storybook**: 部署 Storybook 到 GitHub Pages
- ✅ **build-docker**: 构建和推送 Docker 镜像

**特色**:
- 自动部署文档和组件库
- Docker 镜像自动构建和推送
- 支持手动触发部署

### 3. `release.yml` - 发布工作流
**功能**: 自动化发布
**触发**: Push 到 main 分支

**包含任务**:
- ✅ **release**: 发布 npm 包
- ✅ **create-release**: 创建 GitHub Release

**特色**:
- 使用 Changesets 进行版本管理
- 自动发布到 npm 注册表
- 自动创建 GitHub Release

### 4. `pr-check.yml` - PR 检查工作流
**功能**: Pull Request 质量检查
**触发**: Pull Request，Push 到 main/develop

**包含任务**:
- ✅ **code-quality**: 代码质量检查
- ✅ **coverage-check**: 测试覆盖率检查
- ✅ **security-check**: 安全检查
- ✅ **build-check**: 构建检查
- ✅ **bundle-size**: 包大小检查
- ✅ **commit-message**: 提交信息格式检查

**特色**:
- 严格的代码质量门禁
- 测试覆盖率阈值检查（80%）
- 包大小监控
- 提交信息格式验证

### 5. `nightly.yml` - 夜间构建工作流
**功能**: 定期维护任务
**触发**: 每天凌晨 2 点，手动触发

**包含任务**:
- ✅ **dependency-update**: 依赖更新检查
- ✅ **security-scan**: 安全漏洞扫描
- ✅ **performance-benchmark**: 性能基准测试
- ✅ **docs-check**: 文档完整性检查
- ✅ **migration-check**: 数据库迁移检查

**特色**:
- 自动检测过时依赖
- 定期安全扫描
- 性能基准测试
- 文档完整性验证

## 🔧 配置文件

### `dependabot.yml` - 依赖更新配置
**功能**: 自动依赖更新
**配置**:
- npm 依赖每周更新
- GitHub Actions 每周更新
- Docker 镜像每周更新
- 忽略主要版本更新

### `.github/README.md` - 工作流文档
**内容**: 详细的工作流说明和使用指南

## 🚀 自动化流程

### 开发流程
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发代码
# ... 编写代码 ...

# 3. 提交代码（遵循 Conventional Commits）
git commit -m "feat: add new feature"

# 4. 推送分支
git push origin feature/new-feature

# 5. 创建 Pull Request
# → 自动运行 PR 检查
# → 代码审查
# → 合并到 develop 分支
```

### 发布流程
```bash
# 1. 合并到 main 分支
git checkout main
git merge develop
git push origin main

# 2. 自动触发发布流程
# → 运行 CI/CD
# → 发布 npm 包
# → 创建 GitHub Release
# → 部署文档和 Storybook
```

## 🎯 质量门禁

### 代码质量
- ✅ ESLint 检查通过
- ✅ TypeScript 类型检查通过
- ✅ Prettier 格式化检查通过
- ✅ 无 TODO/FIXME/HACK 注释

### 测试要求
- ✅ 所有测试通过
- ✅ 测试覆盖率 ≥ 80%
- ✅ 集成测试通过

### 构建要求
- ✅ 所有包构建成功
- ✅ 包大小在限制范围内
- ✅ 文档构建成功

### 安全要求
- ✅ npm audit 无高危漏洞
- ✅ Snyk 扫描通过
- ✅ 依赖更新检查通过

## 🔧 环境变量配置

### 必需的 GitHub Secrets
```bash
# NPM 发布
NPM_TOKEN=your_npm_token

# Docker Hub
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# 安全扫描
SNYK_TOKEN=your_snyk_token

# GitHub Pages (自动提供)
GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
```

### 数据库配置
```bash
# 测试环境
DB_HOST=localhost
DB_PORT=5432
DB_NAME=koa_template_test
DB_USER=postgres
DB_PASSWORD=postgres

# 集成测试
DB_NAME=koa_template_integration

# 夜间测试
DB_NAME=koa_template_nightly
```

## 📊 监控和报告

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

## 🎉 优势总结

### 1. **完整的自动化流程**
- 从开发到发布的完整自动化
- 多包 Monorepo 架构支持
- 数据库集成测试

### 2. **严格的质量保证**
- 多层质量检查
- 自动化安全扫描
- 性能监控

### 3. **高效的开发体验**
- 并行测试提高效率
- 快速反馈机制
- 自动化部署

### 4. **专业的项目管理**
- 版本管理自动化
- 文档自动更新
- 依赖自动更新

## 🔗 相关链接

- [GitHub Actions 文档](.github/README.md)
- [工作流配置](.github/workflows/)
- [Dependabot 配置](.github/dependabot.yml)

---

**注意**: 所有工作流都已针对项目的 Monorepo 架构进行了优化，确保高效、可靠的自动化流程。 