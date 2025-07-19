import type {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  RenderTemplateRequest,
  ApiResponse,
  PaginationParams,
  TemplateStats,
  TemplateRender
} from '../types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

class TemplateApi {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络请求失败'
      }
    }
  }

  // 获取模板列表
  async getTemplates(params?: PaginationParams): Promise<ApiResponse<Template[]>> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.size) queryParams.append('size', params.size.toString())

    const queryString = queryParams.toString()
    const endpoint = `/api/templates${queryString ? `?${queryString}` : ''}`
    
    return this.request<Template[]>(endpoint)
  }

  // 获取单个模板
  async getTemplate(id: number): Promise<ApiResponse<Template>> {
    return this.request<Template>(`/api/templates/${id}`)
  }

  // 创建模板
  async createTemplate(data: CreateTemplateRequest): Promise<ApiResponse<Template>> {
    return this.request<Template>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 更新模板
  async updateTemplate(id: number, data: UpdateTemplateRequest): Promise<ApiResponse<Template>> {
    return this.request<Template>(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 删除模板
  async deleteTemplate(id: number): Promise<ApiResponse<{}>> {
    return this.request<{}>(`/api/templates/${id}`, {
      method: 'DELETE',
    })
  }

  // 渲染模板（根据ID）
  async renderTemplate(id: number, data?: Record<string, any>): Promise<ApiResponse<{ content: string; data: Record<string, any> }>> {
    return this.request<{ content: string; data: Record<string, any> }>(`/api/templates/${id}/render`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  // 渲染模板（根据名称）
  async renderTemplateByName(name: string, data?: Record<string, any>): Promise<ApiResponse<{ content: string; data: Record<string, any> }>> {
    return this.request<{ content: string; data: Record<string, any> }>(`/api/templates/render/${name}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  // 获取模板渲染历史
  async getTemplateRenders(id: number): Promise<ApiResponse<TemplateRender[]>> {
    return this.request<TemplateRender[]>(`/api/templates/${id}/renders`)
  }

  // 获取统计信息
  async getStats(): Promise<ApiResponse<TemplateStats>> {
    return this.request<TemplateStats>('/api/templates/stats/overview')
  }

  // 健康检查
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health')
  }
}

export const templateApi = new TemplateApi() 