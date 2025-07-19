export interface Template {
  id: number;
  name: string;
  content: string;
  data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateRender {
  id: number;
  template_id: number;
  rendered_content: string;
  render_data?: any;
  rendered_at?: string;
}

export interface CreateTemplateRequest {
  name: string;
  content: string;
  data?: any;
}

export interface UpdateTemplateRequest {
  name?: string;
  content?: string;
  data?: any;
}

export interface RenderTemplateRequest {
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface TemplateListResponse {
  templates: Template[];
  pagination: {
    limit: number | null;
    offset: number | null;
  };
}

export interface TemplateStats {
  totalTemplates: number;
  totalRenders: number;
  recentRenders: number;
}

export interface TemplateContextType {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: CreateTemplateRequest) => Promise<Template>;
  updateTemplate: (id: number, updates: UpdateTemplateRequest) => Promise<Template>;
  deleteTemplate: (id: number) => Promise<void>;
  renderTemplate: (id: number, data: RenderTemplateRequest) => Promise<string>;
}

export interface TemplateRendererProps {
  templateId?: number;
  templateName?: string;
  data?: RenderTemplateRequest;
  onRender?: (result: string) => void;
  onError?: (error: string) => void;
  autoRender?: boolean;
  className?: string;
}

export interface TemplateEditorProps {
  template?: Template;
  onSave?: (template: Template) => void;
  onCancel?: () => void;
  className?: string;
}

export interface TemplateListProps {
  onSelect?: (template: Template) => void;
  onEdit?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  className?: string;
  showActions?: boolean;
} 