/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: number;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 用户基础信息
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 模板项目
 */
export interface TemplateItem {
  id: number;
  title: string;
  description?: string;
  content: string;
  author: User;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 搜索参数
 */
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination: PaginationParams;
}

/**
 * 文件上传信息
 */
export interface FileUpload {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

/**
 * 配置选项
 */
export interface AppConfig {
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  server: {
    port: number;
    host: string;
  };
  upload: {
    maxSize: number;
    allowedTypes: string[];
  };
} 