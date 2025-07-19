# @koa-html-template/client

基于 React 和 Ant Design 的 Koa HTML 模板引擎客户端组件库。

## 🚀 特性

- ✅ **React 18** 支持最新的 React 特性
- ✅ **TypeScript** 完整的类型安全
- ✅ **Ant Design 5** 现代化的 UI 组件库
- ✅ **响应式设计** 适配各种屏幕尺寸
- ✅ **模块化组件** 可独立使用的组件
- ✅ **React Hooks** 现代化的状态管理
- ✅ **客户端渲染** 支持客户端模板预览

## 📦 安装

```bash
npm install @koa-html-template/client
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

  return (
    <div>
      {/* 你的组件内容 */}
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

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

## 📖 示例

查看 `src/App.tsx` 了解完整的使用示例。

## 🤝 贡献

我们欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📄 许可证

[ISC License](../../LICENSE) © 2024 Jericho 