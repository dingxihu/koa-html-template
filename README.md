# koa-html-template

**🆕 v2.0 - 现已支持 TypeScript!**

这是一个基于 Koa 的模板引擎，可以渲染 HTML 文件进行数据渲染。现在完全支持 TypeScript，并升级到支持 Koa v2.14+。

## 特性

- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **模板变量替换** `{{变量名}}`
- ✅ **条件渲染** `{if条件}内容{/if}`
- ✅ **循环渲染** `{for数组}内容{/for}`
- ✅ **文件包含** `{-include文件路径}`
- ✅ **Koa v2.14+ 兼容**

## 安装

```bash
npm install koa-html-template
```

## TypeScript 使用

```typescript
import Koa from "koa";
import koaHtmlTemplate, { ExtendedContext } from "koa-html-template";

const app = new Koa();

// 使用模板中间件 (默认模板目录: ./static)
app.use(koaHtmlTemplate());

// 或指定模板目录
app.use(koaHtmlTemplate("./templates"));

// 路由处理
app.use(async (ctx: ExtendedContext) => {
  const data = {
    title: "Hello World",
    message: "This is TypeScript!",
    showExtra: true,
    users: [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ],
  };

  ctx.template("index.html", data);
});

app.listen(3000);
```

## JavaScript (CommonJS) 使用

```javascript
const Koa = require("koa");
const koaHtmlTemplate = require("koa-html-template");

const app = new Koa();

app.use(koaHtmlTemplate("./static"));

app.use(async (ctx) => {
  const data = {
    title: "Hello World",
    message: "Welcome!",
  };

  ctx.template("index.html", data);
});

app.listen(3000);
```

## 模板语法

### 1. 变量替换

```html
<h1>{{title}}</h1>
<p>{{message}}</p>
```

### 2. 条件渲染

```html
{if showExtra}
<div>这是额外内容</div>
{/if}
```

### 3. 循环渲染

#### 数组循环

```html
{for users}
<div>
  <span>索引: {$index}</span>
  <span>姓名: {$value.name}</span>
  <span>年龄: {$value.age}</span>
</div>
{/for}
```

#### 对象循环

```html
{for config}
<div>
  <span>键: {$key}</span>
  <span>值: {$value}</span>
</div>
{/for}
```

### 4. 文件包含

```html
{-include "header.html"}
<main>主要内容</main>
{-include "footer.html"}
```

## TypeScript 类型定义

```typescript
// 模板数据接口
interface TemplateData {
  [key: string]: any;
}

// 配置选项接口
interface TemplateOptions {
  // 保留用于未来扩展
}

// 扩展的 Context 接口
interface ExtendedContext extends Context {
  template(filePath: string, data: TemplateData): void;
}
```

## API

### koaHtmlTemplate(htmlPath?, options?)

创建模板中间件。

#### 参数

- `htmlPath` (string, 可选): HTML 模板文件目录路径，默认为 `./static`
- `options` (TemplateOptions, 可选): 配置选项（保留用于未来扩展）

#### 返回值

返回 Koa 中间件函数。

## 目录结构示例

```
project/
├── templates/
│   ├── index.html
│   ├── header.html
│   └── footer.html
├── src/
│   └── app.ts
└── package.json
```

## 升级指南

### 从 v1.x 升级到 v2.x

1. **安装 TypeScript 依赖** (如果使用 TypeScript):

   ```bash
   npm install -D typescript @types/koa @types/node
   ```

2. **更新导入语句**:

   ```typescript
   // TypeScript
   import koaHtmlTemplate, { ExtendedContext } from "koa-html-template";

   // JavaScript - 无需更改
   const koaHtmlTemplate = require("koa-html-template");
   ```

3. **类型注解** (TypeScript):
   ```typescript
   app.use(async (ctx: ExtendedContext) => {
     ctx.template("index.html", data);
   });
   ```

## 注意事项

- 确保模板文件存在于指定目录中
- 模板文件路径是相对于指定的 HTML 目录
- 条件渲染基于 JavaScript 真值判断
- 循环渲染支持数组和普通对象

## 兼容性

- Node.js >= 14.0.0
- Koa >= 2.14.0
- TypeScript >= 5.0.0 (如果使用 TypeScript)

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request!
