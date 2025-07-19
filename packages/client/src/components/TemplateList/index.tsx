import React from 'react'
import type { TemplateListProps } from '../../types'

const TemplateList: React.FC<TemplateListProps> = ({
  templates = [],
  loading = false,
  onEdit,
  onDelete,
  onRender,
}) => {
  if (loading) {
    return <div>加载中...</div>
  }

  if (templates.length === 0) {
    return <div>暂无模板</div>
  }

  return (
    <div>
      <h3>模板列表</h3>
      {templates.map((template) => (
        <div 
          key={template.id} 
          style={{ 
            border: '1px solid #ddd', 
            margin: '8px 0', 
            padding: '16px',
            borderRadius: '4px'
          }}
        >
          <h4>{template.name}</h4>
          <p>{template.content.substring(0, 100)}...</p>
          <div>
            <button onClick={() => onEdit?.(template)}>编辑</button>
            <button onClick={() => onRender?.(template)}>渲染</button>
            <button 
              onClick={() => template.id && onDelete?.(template.id)}
              style={{ color: 'red' }}
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplateList 