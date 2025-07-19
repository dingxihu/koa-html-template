import * as fs from 'fs';
import * as path from 'path';
import { Context, Next, Middleware } from 'koa';

// 由于root-path-plugin没有类型定义，使用require
const root = require('root-path-plugin');

// 扩展RegExp原型，添加类型声明
declare global {
  interface RegExp {
    check(o: any): boolean;
  }
}

if (!RegExp.prototype.check) {
  RegExp.prototype.check = function(o: any): boolean {
    return this.test(o) || this.test(o);
  };
}

export interface TemplateData {
  [key: string]: any;
}

export interface TemplateOptions {
  // 保留用于未来扩展
}

// 扩展后的Context接口
export interface ExtendedContext extends Context {
  template(filePath: string, data: TemplateData): void;
}

/**
 * Koa HTML 模板中间件
 * @param htmlPath HTML文件路径，默认为 /static
 * @param options 配置选项
 * @returns Koa中间件函数
 */
export default function koaHtmlTemplate(
  htmlPath?: string,
  options?: TemplateOptions
): Middleware {
  const htmlpath = htmlPath && path.join(root, '/' + htmlPath) || path.join(root, '/static');

  return async function template(ctx: Context, next: Next): Promise<void> {
    // 扩展ctx对象，添加template方法
    (ctx as ExtendedContext).template = function(filePath: string, data: TemplateData): void {
      const temp = fs.readFileSync(path.join(htmlpath, filePath)).toString();
      
      // 将所有 {{key}} 替换成相应的数据
      this.body = temp
        .replace(/{-include([^{}]+)}/g, (match: string, key: string): string => {
          const includePath = key.trim().replace(/["''"]/g, '');
          const childTemp = fs.readFileSync(path.join(htmlpath, includePath));
          return childTemp.toString();
        })
        .replace(/{{([^{}]+)}}/g, (match: string, key: string): string => {
          const value = data[key.trim()];
          return value !== undefined ? String(value) : '';
        })
        .replace(/{if([^{}]+)}([^{}]+){\/if}/g, (match: string, key1: string, key2: string): string => {
          // if条件判断
          if (data[key1.trim()]) {
            return key2.trim();
          }
          return '';
        })
        .replace(/{for([^{}]+)}([^\bfor\b]+){\/for}/g, (match: string, key1: string, key2: string): string => {
          // for循环
          const obj = data[key1.trim()];
          let s = '';
          
          if (Object.prototype.toString.call(obj) === '[object Object]') {
            // 说明obj是一个对象
            for (const o in obj) {
              s += key2.trim().replace(/{\$([^{}]+)}/g, (match: string, key: string): string => {
                if (key.trim() === 'key') {
                  return String(o);
                }
                if (key.trim() === 'value') {
                  return String(obj[o]);
                }
                return match;
              });
            }
            return s;
          }
          
          if (Array.isArray(obj)) {
            // 说明obj是一个数组
            for (let i = 0, len = obj.length; i < len; i++) {
              s += key2.trim().replace(/{\$([^{}]+)}/g, (match: string, key: string): string => {
                if (key.trim() === 'index') {
                  return String(i);
                }
                if (key.trim() === 'value') {
                  return String(obj[i]);
                }
                if (/\./g.check(key.trim())) {
                  // 说明使用了 {$value.key} 的形式
                  const arr = key.trim().split('.');
                  let ap: any = obj[i];
                  for (let j = 1, len = arr.length; j < len; j++) {
                    ap = ap[arr[j]];
                  }
                  return String(ap);
                }
                return match;
              });
            }
            return s;
          }
          
          return '';
        });
    };
    
    await next();
  };
}

// 也导出为命名导出，保持向后兼容
export { koaHtmlTemplate };

// CommonJS导出支持
module.exports = koaHtmlTemplate;
module.exports.default = koaHtmlTemplate;
module.exports.koaHtmlTemplate = koaHtmlTemplate; 