// 基础类型
export interface Template {
  id: number
  name: string
  content: string
  data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TemplateRenderResult {
  success: boolean
  content?: string
  error?: string
  data?: Record<string, any>
}

// API 请求类型
export interface CreateTemplateRequest {
  name: string
  content: string
  data?: Record<string, any>
}

export interface UpdateTemplateRequest {
  name?: string
  content?: string
  data?: Record<string, any>
}

export interface RenderTemplateRequest {
  data?: Record<string, any>
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  limit?: number
  offset?: number
  page?: number
  size?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number
    page: number
    size: number
    pages: number
  }
}

// 统计类型
export interface TemplateStats {
  total: number
  rendered: number
  errors: number
  averageRenderTime: number
}

// 渲染历史类型
export interface TemplateRender {
  id: number
  template_id: number
  data: Record<string, any>
  result: string
  error?: string
  render_time: number
  created_at: string
}

// 组件 Props 类型
export interface TemplateRendererProps {
  template: Template
  data?: Record<string, any>
  onRender?: (result: TemplateRenderResult) => void
  onError?: (error: string) => void
  templateId?: number
  templateName?: string
  autoRender?: boolean
  className?: string
}

export interface TemplateListProps {
  templates: Template[]
  loading?: boolean
  onEdit?: (template: Template) => void
  onDelete?: (id: number) => void
  onRender?: (template: Template) => void
}

export interface TemplateEditorProps {
  template?: Template
  onSave: (template: Template) => void
  onCancel?: () => void
  loading?: boolean
}

export interface TemplateFormProps {
  initialValues?: Partial<TemplateFormData>
  onSubmit: (values: TemplateFormData) => void
  onCancel?: () => void
  loading?: boolean
}

export interface TemplateFormData {
  name: string
  content: string
  data?: Record<string, any>
}

// Hooks 返回类型
export interface UseTemplateResult {
  template: Template | null
  loading: boolean
  error: string | null
  fetchTemplate: (id: number) => Promise<void>
  updateTemplate: (id: number, data: UpdateTemplateRequest) => Promise<void>
  deleteTemplate: (id: number) => Promise<void>
  renderTemplate: (id: number, data?: Record<string, any>) => Promise<TemplateRenderResult>
  renderTemplateByName: (name: string, data?: Record<string, any>) => Promise<TemplateRenderResult>
}

export interface UseTemplateListResult {
  templates: Template[]
  loading: boolean
  error: string | null
  fetchTemplates: (params?: PaginationParams) => Promise<void>
  createTemplate: (data: CreateTemplateRequest) => Promise<void>
  updateTemplate: (id: number, data: UpdateTemplateRequest) => Promise<void>
  deleteTemplate: (id: number) => Promise<void>
}

export interface UseTemplateRendererResult {
  renderResult: TemplateRenderResult | null
  rendering: boolean
  error: string | null
  renderTemplate: (id: number, data?: Record<string, any>) => Promise<TemplateRenderResult>
  renderByName: (name: string, data?: Record<string, any>) => Promise<TemplateRenderResult>
} 