// 核心模板引擎导出
export { default as TemplateEngine } from './engine/TemplateEngine';
export { default as koaHtmlTemplate } from './middleware/koaMiddleware';

// 类型导出
export * from './types';

// 工具函数导出
export * from './utils';

// 默认导出中间件
export { default } from './middleware/koaMiddleware'; 