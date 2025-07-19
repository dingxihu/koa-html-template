import React from 'react'
import type { TemplateEditorProps } from '../../types'
import TemplateForm from '../TemplateForm'

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  loading = false,
}) => {
  const handleSubmit = (formData: any) => {
    const updatedTemplate = template 
      ? { ...template, ...formData }
      : { id: undefined, ...formData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    
    onSave?.(updatedTemplate)
  }

  return (
    <div>
      <h2>{template ? '编辑模板' : '创建模板'}</h2>
      <TemplateForm
        initialValues={template}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    </div>
  )
}

export default TemplateEditor 