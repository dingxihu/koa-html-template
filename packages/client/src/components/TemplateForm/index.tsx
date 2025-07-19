import React, { useState } from 'react'
import type { TemplateFormProps } from '../../types'

const TemplateForm: React.FC<TemplateFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    content: initialValues.content || '',
    data: JSON.stringify(initialValues.data || {}, null, 2),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const parsedData = JSON.parse(formData.data)
      onSubmit({
        name: formData.name,
        content: formData.content,
        data: parsedData,
      })
    } catch (error) {
      alert('数据格式错误，请输入有效的 JSON')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>模板表单</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label>
          模板名称:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>
          模板内容:
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            style={{ width: '100%', height: '200px', padding: '8px', marginTop: '4px' }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>
          默认数据 (JSON):
          <textarea
            value={formData.data}
            onChange={(e) => handleChange('data', e.target.value)}
            style={{ width: '100%', height: '100px', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>

      <div>
        <button type="submit" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

export default TemplateForm 