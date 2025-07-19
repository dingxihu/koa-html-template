import React from 'react'
import { TemplateRenderer, TemplateList, useTemplateList } from '../index'

// 基础使用示例
export const BasicUsage: React.FC = () => {
  const { templates, loading } = useTemplateList()

  const sampleTemplate = {
    id: 1,
    name: '欢迎页面',
    content: '<h1>欢迎 {{name}}!</h1><p>你的年龄是 {{age}} 岁</p>',
    data: { name: '用户', age: 25 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>基础使用示例</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>模板渲染器</h3>
        <TemplateRenderer
          template={sampleTemplate}
          data={{ name: '张三', age: 30 }}
          onRender={(result) => console.log('渲染结果:', result)}
          onError={(error) => console.error('渲染错误:', error)}
        />
      </div>

      <div>
        <h3>模板列表</h3>
        <TemplateList
          templates={templates.length > 0 ? templates : [sampleTemplate]}
          loading={loading}
          onEdit={(template) => console.log('编辑模板:', template)}
          onDelete={(id) => console.log('删除模板:', id)}
          onRender={(template) => console.log('渲染模板:', template)}
        />
      </div>
    </div>
  )
}

export default BasicUsage 