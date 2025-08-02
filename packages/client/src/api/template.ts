import {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  RenderTemplateRequest,
  ApiResponse,
  PaginationParams,
  TemplateStats,
  TemplateRender
} from '../types';


import { BASE_URL } from '../../constant';

export class TemplateApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }

  // 获取所有模板
  async getTemplates(params?: PaginationParams & { search?: string }): Promise<Template[]> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = `/templates${query ? `?${query}` : ''}`;

    const response = await this.request<Template[]>(endpoint);
    return response.data || [];
  }

  // 根据ID获取模板
  async getTemplate(id: number): Promise<Template> {
    const response = await this.request<Template>(`/templates/${id}`);
    if (!response.data) {
      throw new Error('Template not found');
    }
    return response.data;
  }

  // 根据名称获取模板
  async getTemplateByName(name: string): Promise<Template> {
    const templates = await this.getTemplates({ search: name });
    const template = templates.find(t => t.name === name);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  // 创建模板
  async createTemplate(template: CreateTemplateRequest): Promise<Template> {
    const response = await this.request<Template>('/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });

    if (!response.data) {
      throw new Error('Failed to create template');
    }
    return response.data;
  }

  // 更新模板
  async updateTemplate(id: number, updates: UpdateTemplateRequest): Promise<Template> {
    const response = await this.request<Template>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response.data) {
      throw new Error('Failed to update template');
    }
    return response.data;
  }

  // 删除模板
  async deleteTemplate(id: number): Promise<void> {
    await this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // 渲染模板（按ID）
  async renderTemplate(id: number, data: RenderTemplateRequest): Promise<string> {
    const response = await this.request<{ rendered_content: string }>(`/templates/${id}/render`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.data?.rendered_content) {
      throw new Error('Failed to render template');
    }
    return response.data.rendered_content;
  }

  // 渲染模板（按名称）
  async renderTemplateByName(name: string, data: RenderTemplateRequest): Promise<string> {
    const response = await this.request<{ rendered_content: string }>(`/templates/render/${name}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.data?.rendered_content) {
      throw new Error('Failed to render template');
    }
    return response.data.rendered_content;
  }

  // 获取模板渲染历史
  async getTemplateRenderHistory(id: number, limit?: number): Promise<TemplateRender[]> {
    const query = limit ? `?limit=${limit}` : '';
    const response = await this.request<TemplateRender[]>(`/templates/${id}/renders${query}`);
    return response.data || [];
  }

  // 获取统计信息
  async getStats(): Promise<TemplateStats> {
    const response = await this.request<TemplateStats>('/templates/stats/overview');
    if (!response.data) {
      throw new Error('Failed to get stats');
    }
    return response.data;
  }
}

// 默认客户端实例
export const templateApi = new TemplateApiClient(); 