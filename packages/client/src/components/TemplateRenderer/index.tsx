import React from 'react'
import type { TemplateRendererProps } from '../../types'

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  data = {},
  onRender,
  onError,
}) => {
  return (
    <div>
      <h3>模板渲染器</h3>
      <div>
        <h4>模板: {template.name}</h4>
        <textarea
          value={template.content}
          readOnly
          style={{ width: '100%', height: '100px' }}
        />
      </div>
      <div>
        <h4>数据:</h4>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <button 
        onClick={() => {
          onRender?.({
            rendered_content: template.content,
            template_id: template.id || 0,
            render_data: data
          })
        }}
      >
        渲染
      </button>
    </div>
  )
}

export default TemplateRenderer 