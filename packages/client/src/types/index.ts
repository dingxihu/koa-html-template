// 模板相关类型
export interface Template {
  id?: number
  name: string
  content: string
  data?: Record<string, any>
  created_at?: string
  updated_at?: string
}

// 模板渲染结果
export interface TemplateRenderResult {
  rendered_content: string
  template_id: number
  render_data: Record<string, any>
}

// 模板列表响应
export interface TemplateListResponse {
  success: boolean
  data: Template[]
  pagination?: {
    limit: number | null
    offset: number | null
  }
}

// 模板详情响应
export interface TemplateDetailResponse {
  success: boolean
  data: Template
}

// 模板渲染响应
export interface TemplateRenderResponse {
  success: boolean
  data: TemplateRenderResult
}

// API 错误响应
export interface ApiError {
  success: false
  error: string
  message?: string
}

// 模板表单数据
export interface TemplateFormData {
  name: string
  content: string
  data?: Record<string, any>
}

// 组件 Props 类型
export interface TemplateRendererProps {
  template: Template
  data?: Record<string, any>
  onRender?: (result: TemplateRenderResult) => void
  onError?: (error: string) => void
}

export interface TemplateEditorProps {
  template?: Template
  onSave?: (template: Template) => void
  onCancel?: () => void
  loading?: boolean
}

export interface TemplateListProps {
  templates?: Template[]
  loading?: boolean
  onEdit?: (template: Template) => void
  onDelete?: (id: number) => void
  onRender?: (template: Template) => void
}

export interface TemplateFormProps {
  initialValues?: Partial<TemplateFormData>
  onSubmit: (values: TemplateFormData) => void
  onCancel?: () => void
  loading?: boolean
}

// Hook 返回类型
export interface UseTemplateResult {
  template: Template | null
  loading: boolean
  error: string | null
  fetchTemplate: (id: number) => Promise<void>
  updateTemplate: (id: number, data: Partial<Template>) => Promise<void>
  deleteTemplate: (id: number) => Promise<void>
}

export interface UseTemplateListResult {
  templates: Template[]
  loading: boolean
  error: string | null
  fetchTemplates: (params?: { limit?: number; offset?: number; search?: string }) => Promise<void>
  createTemplate: (data: TemplateFormData) => Promise<void>
  refreshTemplates: () => Promise<void>
}

export interface UseTemplateRendererResult {
  renderResult: TemplateRenderResult | null
  rendering: boolean
  error: string | null
  renderTemplate: (templateId: number, data?: Record<string, any>) => Promise<void>
  renderByName: (name: string, data?: Record<string, any>) => Promise<void>
} 