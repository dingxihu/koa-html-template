/**
 * 模板数据接口
 */
export interface TemplateData {
  [key: string]: any;
}

/**
 * 模板配置选项接口
 */
export interface TemplateOptions {
  /** 是否启用缓存，默认: true */
  cache?: boolean;
  /** 是否启用调试模式，默认: false */
  debug?: boolean;
  /** 文件编码，默认: 'utf8' */
  encoding?: 'utf8' | 'ascii' | 'base64' | 'binary' | 'hex';
  /** 最大缓存大小，默认: 100 */
  maxCacheSize?: number;
  /** 模板文件扩展名，默认: '.html' */
  extension?: string;
}

/**
 * 扩展的 Koa Context 接口
 */
export interface ExtendedContext {
  template(filePath: string, data?: TemplateData): void;
  type: string;
  body: any;
  status: number;
}

/**
 * 模板引擎接口
 */
export interface ITemplateEngine {
  render(template: string, data: TemplateData): string;
  renderFile(filePath: string, data: TemplateData): Promise<string>;
  clearCache(): void;
}

/**
 * 模板语法错误
 */
export class TemplateError extends Error {
  constructor(message: string, public template?: string, public line?: number) {
    super(message);
    this.name = 'TemplateError';
  }
}

/**
 * 模板渲染上下文
 */
export interface RenderContext {
  data: TemplateData;
  basePath: string;
  currentPath: string;
  includeStack: string[];
} 