import * as fs from 'fs';
import * as path from 'path';
import { ITemplateEngine, TemplateData, TemplateOptions, TemplateError, RenderContext } from '../types';

/**
 * 核心模板引擎实现
 */
export default class TemplateEngine implements ITemplateEngine {
  private cache = new Map<string, string>();
  private options: Required<TemplateOptions>;

  constructor(private basePath: string = './static', options: TemplateOptions = {}) {
    this.options = {
      cache: true,
      debug: false,
      encoding: 'utf8',
      maxCacheSize: 100,
      extension: '.html',
      ...options,
    };
  }

  /**
   * 渲染模板字符串
   */
  render(template: string, data: TemplateData = {}): string {
    try {
      const context: RenderContext = {
        data,
        basePath: this.basePath,
        currentPath: '',
        includeStack: [],
      };
      return this.processTemplate(template, context);
    } catch (error) {
      if (this.options.debug) {
        console.error('Template render error:', error);
      }
      throw error;
    }
  }

  /**
   * 渲染模板文件
   */
  async renderFile(filePath: string, data: TemplateData = {}): Promise<string> {
    const fullPath = path.resolve(this.basePath, filePath);
    
    // 检查缓存
    if (this.options.cache && this.cache.has(fullPath)) {
      return this.render(this.cache.get(fullPath)!, data);
    }

    try {
      const template = await fs.promises.readFile(fullPath, this.options.encoding);
      
      // 添加到缓存
      if (this.options.cache) {
        this.addToCache(fullPath, template);
      }

      const context: RenderContext = {
        data,
        basePath: this.basePath,
        currentPath: path.dirname(fullPath),
        includeStack: [fullPath],
      };

      return this.processTemplate(template, context);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new TemplateError(`Template file not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 处理模板内容
   */
  private processTemplate(template: string, context: RenderContext): string {
    let result = template;

    // 处理注释 {# comment #}
    result = this.processComments(result);

    // 处理文件包含 {-include "file.html"}
    result = this.processIncludes(result, context);

    // 处理条件渲染 {if condition}...{/if}
    result = this.processConditions(result, context);

    // 处理循环渲染 {for array}...{/for}
    result = this.processLoops(result, context);

    // 处理变量替换 {{variable}}
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * 处理注释
   */
  private processComments(template: string): string {
    return template.replace(/\{#[\s\S]*?#\}/g, '');
  }

  /**
   * 处理文件包含
   */
  private processIncludes(template: string, context: RenderContext): string {
    const includeRegex = /\{-include\s+["']([^"']+)["']\s*\}/g;
    
    return template.replace(includeRegex, (match, filePath) => {
      const fullPath = path.resolve(context.basePath, filePath);
      
      // 防止循环包含
      if (context.includeStack.includes(fullPath)) {
        throw new TemplateError(`Circular include detected: ${filePath}`);
      }

      try {
        const includeContent = fs.readFileSync(fullPath, this.options.encoding);
        const newContext: RenderContext = {
          ...context,
          currentPath: path.dirname(fullPath),
          includeStack: [...context.includeStack, fullPath],
        };
        
        return this.processTemplate(includeContent, newContext);
      } catch (error) {
        if (this.options.debug) {
          console.error(`Include error for ${filePath}:`, error);
        }
        throw new TemplateError(`Failed to include file: ${filePath}`);
      }
    });
  }

  /**
   * 处理条件渲染
   */
  private processConditions(template: string, context: RenderContext): string {
    const conditionRegex = /\{if\s+([^}]+)\}([\s\S]*?)\{\/if\}/g;
    
    return template.replace(conditionRegex, (match, condition, content) => {
      try {
        const isTrue = this.evaluateCondition(condition.trim(), context.data);
        return isTrue ? this.processTemplate(content, context) : '';
      } catch (error) {
        throw new TemplateError(`Condition evaluation error: ${condition}`);
      }
    });
  }

  /**
   * 处理循环渲染
   */
  private processLoops(template: string, context: RenderContext): string {
    const loopRegex = /\{for\s+([^}]+)\}([\s\S]*?)(?:\{else\}([\s\S]*?))?\{\/for\}/g;
    
    return template.replace(loopRegex, (match, arrayName, content, elseContent = '') => {
      try {
        const arrayData = this.getValue(arrayName.trim(), context.data);
        
        if (!arrayData || (Array.isArray(arrayData) && arrayData.length === 0)) {
          return this.processTemplate(elseContent, context);
        }

        if (Array.isArray(arrayData)) {
          return arrayData.map((item, index) => {
            const loopContext: RenderContext = {
              ...context,
              data: {
                ...context.data,
                $index: index,
                $value: item,
              },
            };
            return this.processTemplate(content, loopContext);
          }).join('');
        } else if (typeof arrayData === 'object') {
          return Object.entries(arrayData).map(([key, value]) => {
            const loopContext: RenderContext = {
              ...context,
              data: {
                ...context.data,
                $key: key,
                $value: value,
              },
            };
            return this.processTemplate(content, loopContext);
          }).join('');
        }

        return '';
      } catch (error) {
        throw new TemplateError(`Loop processing error: ${arrayName}`);
      }
    });
  }

  /**
   * 处理变量替换
   */
  private processVariables(template: string, context: RenderContext): string {
    // 处理三重大括号 {{{variable}}} (不转义HTML)
    template = template.replace(/\{\{\{([^}]+)\}\}\}/g, (match, varName) => {
      const value = this.getValue(varName.trim(), context.data);
      return String(value ?? '');
    });

    // 处理双重大括号 {{variable}} (转义HTML)
    template = template.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const value = this.getValue(varName.trim(), context.data);
      return this.escapeHtml(String(value ?? ''));
    });

    return template;
  }

  /**
   * 获取变量值
   */
  private getValue(path: string, data: TemplateData): any {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
      if (value == null) return undefined;
      value = value[key];
    }

    return value;
  }

  /**
   * 评估条件表达式
   */
  private evaluateCondition(condition: string, data: TemplateData): boolean {
    // 处理否定条件
    if (condition.startsWith('!')) {
      return !this.evaluateCondition(condition.slice(1), data);
    }

    // 处理比较运算符
    const comparisonRegex = /(.+?)\s*(>=|<=|>|<|===|!==|==|!=)\s*(.+)/;
    const match = condition.match(comparisonRegex);
    
    if (match) {
      const [, left, operator, right] = match;
      if (!left || !right) {
        return false;
      }
      
      const leftValue = this.getValue(left.trim(), data);
      const rightValue = this.parseValue(right.trim(), data);
      
      switch (operator) {
        case '>=': return leftValue >= rightValue;
        case '<=': return leftValue <= rightValue;
        case '>': return leftValue > rightValue;
        case '<': return leftValue < rightValue;
        case '===': return leftValue === rightValue;
        case '!==': return leftValue !== rightValue;
        case '==': return leftValue == rightValue;
        case '!=': return leftValue != rightValue;
        default: return false;
      }
    }

    // 简单的真值判断
    const value = this.getValue(condition, data);
    return Boolean(value);
  }

  /**
   * 解析值（数字、字符串、布尔值、变量）
   */
  private parseValue(value: string, data: TemplateData): any {
    // 数字
    if (/^\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
    
    // 字符串
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // 布尔值
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // 变量
    return this.getValue(value, data);
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    
    return text.replace(/[&<>"']/g, (char) => {
      const escaped = map[char];
      return escaped !== undefined ? escaped : char;
    });
  }

  /**
   * 添加到缓存
   */
  private addToCache(key: string, value: string): void {
    if (this.cache.size >= this.options.maxCacheSize) {
      // 删除最旧的缓存项
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
} 