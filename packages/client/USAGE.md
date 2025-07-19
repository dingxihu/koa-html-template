# 使用指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @koa-html-template/client
```

### 2. 基础使用

```tsx
import React from 'react'
import { TemplateRenderer } from '@koa-html-template/client'

const App = () => {
  const template = {
    id: 1,
    name: '欢迎页面',
    content: '<h1>欢迎 {{name}}!</h1>',
    data: { name: '用户' }
  }

  return (
    <TemplateRenderer
      template={template}
      data={{ name: '张三' }}
      onRender={(result) => console.log(result)}
    />
  )
}
```

## 🧩 组件使用

### TemplateRenderer - 模板渲染器

用于渲染模板内容，支持客户端预览。

```tsx
<TemplateRenderer
  template={template}
  data={{ name: '张三', age: 30 }}
  onRender={(result) => console.log('渲染成功:', result)}
  onError={(error) => console.error('渲染失败:', error)}
/>
```

**Props:**
- `template: Template` - 模板对象（必需）
- `data?: Record<string, any>` - 渲染数据
- `onRender?: (result: TemplateRenderResult) => void` - 渲染成功回调
- `onError?: (error: string) => void` - 渲染错误回调

### TemplateList - 模板列表

展示模板列表，支持编辑、删除、渲染操作。

```tsx
<TemplateList
  templates={templates}
  loading={false}
  onEdit={(template) => console.log('编辑:', template)}
  onDelete={(id) => console.log('删除:', id)}
  onRender={(template) => console.log('渲染:', template)}
/>
```

**Props:**
- `templates: Template[]` - 模板列表
- `loading?: boolean` - 加载状态
- `onEdit?: (template: Template) => void` - 编辑回调
- `onDelete?: (id: number) => void` - 删除回调
- `onRender?: (template: Template) => void` - 渲染回调

### TemplateEditor - 模板编辑器

用于创建和编辑模板。

```tsx
<TemplateEditor
  template={existingTemplate} // 编辑现有模板，不传则创建新模板
  onSave={(template) => console.log('保存:', template)}
  onCancel={() => console.log('取消')}
  loading={false}
/>
```

**Props:**
- `template?: Template` - 要编辑的模板（不传则创建新模板）
- `onSave: (template: Template) => void` - 保存回调
- `onCancel?: () => void` - 取消回调
- `loading?: boolean` - 保存状态

### TemplateForm - 模板表单

提供表单输入功能。

```tsx
<TemplateForm
  initialValues={{ name: '模板名称', content: '<div>内容</div>' }}
  onSubmit={(values) => console.log('提交:', values)}
  onCancel={() => console.log('取消')}
  loading={false}
/>
```

**Props:**
- `initialValues?: Partial<TemplateFormData>` - 初始值
- `onSubmit: (values: TemplateFormData) => void` - 提交回调
- `onCancel?: () => void` - 取消回调
- `loading?: boolean` - 提交状态

## 🪝 Hooks 使用

### useTemplate - 单个模板管理

```tsx
const { template, loading, error, fetchTemplate, updateTemplate, deleteTemplate } = useTemplate()

// 获取模板
await fetchTemplate(1)

// 更新模板
await updateTemplate(1, { name: '新名称', content: '新内容' })

// 删除模板
await deleteTemplate(1)
```

### useTemplateList - 模板列表管理

```tsx
const { templates, loading, error, fetchTemplates, createTemplate } = useTemplateList()

// 获取模板列表
await fetchTemplates({ limit: 10, offset: 0 })

// 创建模板
await createTemplate({ 
  name: '新模板', 
  content: '<div>{{title}}</div>',
  data: { title: '默认标题' }
})
```

### useTemplateRenderer - 模板渲染管理

```tsx
const { renderResult, rendering, error, renderTemplate, renderByName } = useTemplateRenderer()

// 根据ID渲染
await renderTemplate(1, { name: '张三', age: 30 })

// 根据名称渲染
await renderByName('welcome', { name: '李四' })
```

## 🎨 样式定制

### 主题定制

```tsx
import { ConfigProvider } from 'antd'
import { TemplateRenderer } from '@koa-html-template/client'

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
      },
    }}
  >
    <TemplateRenderer template={template} />
  </ConfigProvider>
)
```

### CSS 样式覆盖

```css
/* 覆盖组件样式 */
.template-renderer {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}

.template-list {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.template-editor {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## 🔧 配置

### API 基础地址

```bash
# .env
VITE_API_URL=http://localhost:3000
```

### 环境变量

```env
# API 配置
VITE_API_URL=http://localhost:3000

# 开发配置
VITE_DEV_MODE=true
VITE_ENABLE_MOCK=false
```

## 📝 模板语法

### 变量替换

```html
<!-- 基础变量 -->
<h1>{{title}}</h1>

<!-- 嵌套属性 -->
<p>{{user.name}} - {{user.age}}岁</p>

<!-- 不转义HTML -->
<div>{{{htmlContent}}}</div>
```

### 条件渲染

```html
{if user.isAdmin}
  <button>管理员面板</button>
{/if}

{if !user.isActive}
  <div class="warning">账户已禁用</div>
{/if}
```

### 循环渲染

```html
<!-- 数组循环 -->
{for users}
  <li>{{$value.name}} - {{$index}}</li>
{else}
  <li>暂无用户</li>
{/for}

<!-- 对象循环 -->
{for settings}
  <tr>
    <td>{{$key}}</td>
    <td>{{$value}}</td>
  </tr>
{/for}
```

### 注释

```html
{# 这是模板注释，不会在输出中显示 #}
```

## 🧪 测试

### 组件测试

```tsx
import { render, screen } from '@testing-library/react'
import { TemplateRenderer } from '@koa-html-template/client'

test('renders template content', () => {
  const template = {
    id: 1,
    name: '测试模板',
    content: '<h1>{{title}}</h1>'
  }
  
  render(<TemplateRenderer template={template} data={{ title: '测试标题' }} />)
  expect(screen.getByText('测试标题')).toBeInTheDocument()
})
```

### Hooks 测试

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useTemplateList } from '@koa-html-template/client'

test('fetches templates', async () => {
  const { result } = renderHook(() => useTemplateList())
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
  
  expect(result.current.templates).toBeDefined()
})
```

## 🔧 故障排除

### 常见问题

**1. 依赖安装失败**
```bash
# 清理缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

**2. Vite 插件错误**
```bash
# 检查 Vite 版本
npm list vite

# 重新安装 Vite 插件
npm install @vitejs/plugin-react --save-dev
```

**3. API 连接失败**
```bash
# 检查 API 服务器
curl http://localhost:3000/health

# 检查环境变量
echo $VITE_API_URL
```

**4. TypeScript 类型错误**
```bash
# 检查 TypeScript 版本
npm list typescript

# 重新生成类型文件
npm run build
```

### 调试技巧

1. **启用调试模式**
   ```tsx
   <TemplateRenderer 
     template={template} 
     debug={true}
   />
   ```

2. **查看网络请求**
   - 打开浏览器开发者工具
   - 查看 Network 标签页
   - 检查 API 调用是否成功

3. **使用 React DevTools**
   - 安装 React DevTools 浏览器扩展
   - 查看组件状态和 props

## 📚 更多资源

- [完整文档](../README.md)
- [API 参考](./api/)
- [示例代码](./examples/)
- [Storybook 文档](http://localhost:6006)

## 🤝 贡献

我们欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。 