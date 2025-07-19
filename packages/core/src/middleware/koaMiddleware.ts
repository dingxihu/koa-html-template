import TemplateEngine from '../engine/TemplateEngine';
import { TemplateData, TemplateOptions } from '../types';

/**
 * Koa 中间件函数类型
 */
export type KoaMiddleware = (ctx: any, next: () => Promise<void>) => Promise<void>;

/**
 * Koa HTML Template 中间件
 */
export default function koaHtmlTemplate(
  htmlPath: string = './static',
  options: TemplateOptions = {}
): KoaMiddleware {
  const engine = new TemplateEngine(htmlPath, options);

  return async (ctx: any, next: () => Promise<void>) => {
    // 添加 template 方法到 context
    ctx.template = function(filePath: string, data: TemplateData = {}) {
      engine.renderFile(filePath, data)
        .then(html => {
          ctx.type = 'text/html';
          ctx.body = html;
        })
        .catch(error => {
          // 简化错误处理，避免使用console
          ctx.status = 500;
          ctx.body = 'Template rendering error';
          if (options.debug && error) {
            ctx.body = `Template rendering error: ${error.message}`;
          }
        });
    };

    await next();
  };
} 