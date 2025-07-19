import type {
  Template,
  TemplateFormData,
  TemplateListResponse,
  TemplateDetailResponse,
  TemplateRenderResponse,
  ApiError,
} from '../types'

// 配置基础URL
const BASE_URL = 'http://localhost:3000'

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || '请求失败')
    }
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const templateApi = {
  // 获取模板列表
  async getTemplates(params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<TemplateListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    const endpoint = `/api/templates${query ? `?${query}` : ''}`
    
    return request<TemplateListResponse>(endpoint)
  },

  // 根据ID获取模板
  async getTemplate(id: number): Promise<TemplateDetailResponse> {
    return request<TemplateDetailResponse>(`/api/templates/${id}`)
  },

  // 创建模板
  async createTemplate(data: TemplateFormData): Promise<TemplateDetailResponse> {
    return request<TemplateDetailResponse>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 更新模板
  async updateTemplate(
    id: number,
    data: Partial<TemplateFormData>
  ): Promise<TemplateDetailResponse> {
    return request<TemplateDetailResponse>(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // 删除模板
  async deleteTemplate(id: number): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/templates/${id}`, {
      method: 'DELETE',
    })
  },

  // 根据ID渲染模板
  async renderTemplate(
    id: number,
    data?: Record<string, any>
  ): Promise<TemplateRenderResponse> {
    return request<TemplateRenderResponse>(`/api/templates/${id}/render`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  },

  // 根据名称渲染模板
  async renderTemplateByName(
    name: string,
    data?: Record<string, any>
  ): Promise<TemplateRenderResponse> {
    return request<TemplateRenderResponse>(`/api/templates/render/${name}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  },

  // 获取模板渲染历史
  async getTemplateRenders(
    id: number,
    limit?: number
  ): Promise<{
    success: boolean
    data: Array<{
      id: number
      template_id: number
      rendered_content: string
      render_data: Record<string, any>
      rendered_at: string
    }>
  }> {
    const query = limit ? `?limit=${limit}` : ''
    return request(`/api/templates/${id}/renders${query}`)
  },

  // 获取统计信息
  async getStats(): Promise<{
    success: boolean
    data: {
      totalTemplates: number
      totalRenders: number
      recentRenders: number
    }
  }> {
    return request('/api/templates/stats/overview')
  },

  // 健康检查
  async healthCheck(): Promise<{
    status: string
    timestamp: string
  }> {
    return request('/health')
  },
} 