# @koa-html-template/client

基于 React 18 和 Ant Design 5 的 Koa HTML 模板引擎客户端组件库。

## 🚀 特性

- ✅ **React 18** 支持最新的 React 特性
- ✅ **TypeScript** 完整的类型安全
- ✅ **Ant Design 5** 现代化的 UI 组件库
- ✅ **响应式设计** 适配各种屏幕尺寸
- ✅ **模块化组件** 可独立使用的组件
- ✅ **React Hooks** 现代化的状态管理
- ✅ **客户端渲染** 支持客户端模板预览
- ✅ **服务端渲染** 支持服务端模板渲染
- ✅ **Storybook** 组件文档和测试
- ✅ **Vite** 快速的开发体验

## 📦 安装

### 从 npm 安装

```bash
npm install @koa-html-template/client
```

### 从源码安装

```bash
# 克隆项目
git clone https://github.com/dingxihu/koa-html-template.git
cd koa-html-template

# 安装依赖
npm install

# 构建客户端包
npm run build:client
```

### 依赖要求

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

## 🎯 快速开始

### 基础使用

```tsx
import React from 'react'
import { TemplateRenderer, TemplateList } from '@koa-html-template/client'

const App = () => {
  const template = {
    id: 1,
    name: '欢迎页面',
    content: '<h1>欢迎 {{name}}!</h1>',
    data: { name: '张三' }
  }

  return (
    <div>
      <TemplateRenderer
        template={template}
        data={{ name: '李四' }}
        onRender={(result) => console.log(result)}
      />
    </div>
  )
}
```

### 使用 Hooks

```tsx
import { useTemplateList, useTemplateRenderer } from '@koa-html-template/client'

const TemplateManager = () => {
  const { templates, loading, fetchTemplates } = useTemplateList()
  const { renderTemplate, rendering } = useTemplateRenderer()

  React.useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <div>
      {loading ? '加载中...' : (
        <TemplateList templates={templates} />
      )}
    </div>
  )
}
```

### 完整示例

```tsx
import React, { useState } from 'react'
import { 
  TemplateRenderer, 
  TemplateList, 
  TemplateEditor,
  useTemplateList 
} from '@koa-html-template/client'

const TemplateApp = () => {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'renderer'>('list')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  
  const { templates, loading, createTemplate } = useTemplateList()

  const handleEdit = (template) => {
    setSelectedTemplate(template)
    setCurrentView('editor')
  }

  const handleRender = (template) => {
    setSelectedTemplate(template)
    setCurrentView('renderer')
  }

  const handleSave = async (template) => {
    await createTemplate(template)
    setCurrentView('list')
  }

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentView('list')}>模板列表</button>
        <button onClick={() => setCurrentView('editor')}>新建模板</button>
      </nav>

      {currentView === 'list' && (
        <TemplateList
          templates={templates}
          loading={loading}
          onEdit={handleEdit}
          onRender={handleRender}
        />
      )}

      {currentView === 'editor' && (
        <TemplateEditor
          template={selectedTemplate}
          onSave={handleSave}
          onCancel={() => setCurrentView('list')}
        />
      )}

      {currentView === 'renderer' && selectedTemplate && (
        <TemplateRenderer
          template={selectedTemplate}
          data={selectedTemplate.data || {}}
        />
      )}
    </div>
  )
}
```

## 🧩 组件

### TemplateRenderer

模板渲染组件，支持客户端预览和服务端渲染。

```tsx
<TemplateRenderer
  template={template}
  data={{ name: '用户名' }}
  onRender={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>
```

**Props:**
- `template: Template` - 模板对象
- `data?: Record<string, any>` - 渲染数据
- `onRender?: (result: TemplateRenderResult) => void` - 渲染成功回调
- `onError?: (error: string) => void` - 渲染错误回调

### TemplateList

模板列表组件，展示和管理模板。

```tsx
<TemplateList
  templates={templates}
  loading={loading}
  onEdit={(template) => console.log('编辑', template)}
  onDelete={(id) => console.log('删除', id)}
  onRender={(template) => console.log('渲染', template)}
/>
```

**Props:**
- `templates?: Template[]` - 模板列表
- `loading?: boolean` - 加载状态
- `onEdit?: (template: Template) => void` - 编辑回调
- `onDelete?: (id: number) => void` - 删除回调
- `onRender?: (template: Template) => void` - 渲染回调

### TemplateEditor

模板编辑器组件，用于创建和编辑模板。

```tsx
<TemplateEditor
  template={template}
  onSave={(template) => console.log('保存', template)}
  onCancel={() => console.log('取消')}
  loading={false}
/>
```

**Props:**
- `template?: Template` - 编辑的模板（空则为创建）
- `onSave?: (template: Template) => void` - 保存回调
- `onCancel?: () => void` - 取消回调
- `loading?: boolean` - 保存状态

### TemplateForm

模板表单组件，提供表单输入功能。

```tsx
<TemplateForm
  initialValues={{ name: '模板名称' }}
  onSubmit={(data) => console.log('提交', data)}
  onCancel={() => console.log('取消')}
  loading={false}
/>
```

**Props:**
- `initialValues?: Partial<TemplateFormData>` - 初始值
- `onSubmit: (values: TemplateFormData) => void` - 提交回调
- `onCancel?: () => void` - 取消回调
- `loading?: boolean` - 提交状态

## 🪝 Hooks

### useTemplate

管理单个模板的状态和操作。

```tsx
const { template, loading, error, fetchTemplate, updateTemplate, deleteTemplate } = useTemplate()

// 获取模板
await fetchTemplate(1)

// 更新模板
await updateTemplate(1, { name: '新名称' })

// 删除模板
await deleteTemplate(1)
```

### useTemplateList

管理模板列表的状态和操作。

```tsx
const { templates, loading, error, fetchTemplates, createTemplate } = useTemplateList()

// 获取模板列表
await fetchTemplates({ limit: 10 })

// 创建模板
await createTemplate({ name: '新模板', content: '<div>内容</div>' })
```

### useTemplateRenderer

管理模板渲染的状态和操作。

```tsx
const { renderResult, rendering, error, renderTemplate, renderByName } = useTemplateRenderer()

// 根据ID渲染
await renderTemplate(1, { name: '张三' })

// 根据名称渲染
await renderByName('welcome', { name: '李四' })
```

## 🛠️ 开发

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 测试
npm run test

# 代码检查
npm run lint
```

### Storybook

```bash
# 启动 Storybook
npm run storybook

# 构建 Storybook
npm run build-storybook
```

### 测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

## 🎨 自定义

### 主题定制

客户端组件基于 Ant Design，支持主题定制：

```tsx
import { ConfigProvider } from 'antd'
import { TemplateRenderer } from '@koa-html-template/client'

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff',
      },
    }}
  >
    <TemplateRenderer template={template} />
  </ConfigProvider>
)
```

### 样式覆盖

```css
/* 覆盖组件样式 */
.template-renderer {
  background: #f5f5f5;
}

.template-list {
  border: 1px solid #d9d9d9;
}
```

### 国际化

```tsx
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const App = () => (
  <ConfigProvider locale={zhCN}>
    <TemplateRenderer template={template} />
  </ConfigProvider>
)
```

## 📝 模板语法

支持的模板语法：

### 变量替换
```html
<!-- 基础变量 -->
<h1>{{title}}</h1>

<!-- 嵌套属性 -->
<p>{{user.name}}</p>

<!-- 不转义 HTML -->
<div>{{{htmlContent}}}</div>
```

### 条件渲染
```html
{if user.isAdmin}
  <button>管理员按钮</button>
{/if}
```

### 循环渲染
```html
{for users}
  <div>{{$value.name}} - {{$index}}</div>
{/for}
```

### 注释
```html
{# 这是注释 #}
```

## 🔧 配置

### API 基础地址

默认 API 地址为 `http://localhost:3000`，可通过环境变量配置：

```bash
# .env
VITE_API_URL=http://your-api-server.com
```

### TypeScript

所有组件都有完整的 TypeScript 类型定义，支持类型提示和检查。

```tsx
import type { Template, TemplateRenderResult } from '@koa-html-template/client'

const MyComponent = ({ template }: { template: Template }) => {
  // 完整的类型支持
}
```

### 环境变量

```env
# API 配置
VITE_API_URL=http://localhost:3000

# 开发配置
VITE_DEV_MODE=true
VITE_ENABLE_MOCK=false
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

### 测试示例

```tsx
import { render, screen } from '@testing-library/react'
import { TemplateRenderer } from '@koa-html-template/client'

test('renders template name', () => {
  const template = {
    id: 1,
    name: '测试模板',
    content: '<h1>{{title}}</h1>'
  }
  
  render(<TemplateRenderer template={template} />)
  expect(screen.getByText('测试模板')).toBeInTheDocument()
})
```

## 🔧 故障排除

### 常见问题

**依赖安装失败**
```bash
# 清理缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

**Vite 插件错误**
```bash
# 检查 Vite 版本
npm list vite

# 重新安装 Vite 插件
npm install @vitejs/plugin-react --save-dev
```

**TypeScript 类型错误**
```bash
# 检查 TypeScript 版本
npm list typescript

# 重新生成类型文件
npm run build
```

**API 连接失败**
```bash
# 检查 API 服务器
curl http://localhost:3000/health

# 检查环境变量
echo $VITE_API_URL
```

### 调试技巧

1. **启用调试模式**
   ```tsx
   // 在组件中启用调试
   <TemplateRenderer 
     template={template} 
     debug={true}
   />
   ```

2. **查看网络请求**
   ```tsx
   // 在浏览器开发者工具中查看网络请求
   // 检查 API 调用是否成功
   ```

3. **使用 React DevTools**
   ```tsx
   // 安装 React DevTools 扩展
   // 查看组件状态和 props
   ```

## 📖 示例

查看 `src/App.tsx` 了解完整的使用示例。

### 更多示例

- [基础渲染](./examples/basic-render.tsx)
- [列表管理](./examples/list-management.tsx)
- [表单编辑](./examples/form-editor.tsx)
- [自定义主题](./examples/custom-theme.tsx)

## 🤝 贡献

我们欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

### 开发流程

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 开启 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加测试用例
- 更新文档

## 📄 许可证

[ISC License](../../LICENSE) © 2024 Jericho

## 🔗 相关链接

- [项目主页](https://github.com/dingxihu/koa-html-template)
- [在线文档](https://dingxihu.github.io/koa-html-template)
- [API 文档](./api/)
- [更新日志](../../CHANGELOG.md) 