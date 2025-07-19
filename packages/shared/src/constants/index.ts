/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * API 错误代码
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TEMPLATE_ERROR: 'TEMPLATE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
} as const;

/**
 * 支持的文件类型
 */
export const SUPPORTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'text/plain', 'application/msword'],
  TEMPLATES: ['text/html', 'text/plain'],
} as const;

/**
 * 默认分页设置
 */
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * 缓存键前缀
 */
export const CACHE_KEYS = {
  USER: 'user:',
  TEMPLATE: 'template:',
  SESSION: 'session:',
} as const;

/**
 * 环境变量
 */
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

/**
 * 模板引擎配置
 */
export const TEMPLATE_CONFIG = {
  DEFAULT_EXTENSION: '.html',
  DEFAULT_ENCODING: 'utf8',
  DEFAULT_CACHE_SIZE: 100,
  INCLUDE_REGEX: /\{-include\s+["']([^"']+)["']\s*\}/g,
  VARIABLE_REGEX: /\{\{([^}]+)\}\}/g,
  CONDITION_REGEX: /\{if\s+([^}]+)\}([\s\S]*?)\{\/if\}/g,
  LOOP_REGEX: /\{for\s+([^}]+)\}([\s\S]*?)(?:\{else\}([\s\S]*?))?\{\/for\}/g,
} as const; 