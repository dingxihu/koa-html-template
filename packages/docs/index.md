---
layout: home

hero:
  name: "Koa HTML Template"
  text: "现代化的模板引擎"
  tagline: "基于 Koa 的高性能 HTML 模板引擎，完整支持 TypeScript"
  image:
    src: /logo.svg
    alt: Koa HTML Template
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/basic

features:
  - icon: ⚡️
    title: 高性能
    details: 内置缓存系统，优化的模板编译，支持大规模应用
  - icon: 🔧
    title: TypeScript 支持
    details: 完整的类型定义，更好的开发体验和代码提示
  - icon: 🎨
    title: 灵活的语法
    details: 简洁直观的模板语法，支持条件渲染、循环、文件包含
  - icon: 📦
    title: Monorepo 架构
    details: 模块化设计，核心、服务器、客户端分离，易于维护
  - icon: 🛡️
    title: 安全可靠
    details: 内置 XSS 防护，错误处理机制，生产环境就绪
  - icon: 📚
    title: 丰富文档
    details: 详细的文档和示例，从入门到高级用法一应俱全
---

## 快速体验

```bash
# 安装
npm install @koa-html-template/core

# 创建应用
mkdir my-app && cd my-app
npm init -y
npm install koa @koa-html-template/core
```

```typescript
import Koa from 'koa'
import koaHtmlTemplate from '@koa-html-template/core'

const app = new Koa()

// 使用模板中间件
app.use(koaHtmlTemplate('./templates'))

app.use(async (ctx) => {
  ctx.template('index.html', {
    title: '欢迎使用 Koa HTML Template',
    message: '这是一个强大的模板引擎！'
  })
})

app.listen(3000)
```

## 特性亮点

### 🚀 现代化架构
采用 TypeScript 构建，支持 ES6+ 语法，提供完整的类型支持。

### 📱 全栈解决方案
提供服务端渲染和客户端组件，满足各种应用场景需求。

### 🔥 开发体验
热重载、代码提示、错误调试，让开发更加高效。

### 📈 生产就绪
经过充分测试，内置缓存和优化机制，适合生产环境使用。 