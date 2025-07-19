import React, { useState } from 'react'
import TemplateList from './components/TemplateList'
import TemplateEditor from './components/TemplateEditor'
import TemplateRenderer from './components/TemplateRenderer'
import { useTemplateList } from './hooks/useTemplateList'
import type { Template } from './types'

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'renderer'>('list')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  
  const { templates, loading, createTemplate, refreshTemplates } = useTemplateList()

  // 示例模板数据
  const sampleTemplates: Template[] = [
    {
      id: 1,
      name: '欢迎页面',
      content: '<h1>欢迎 {{name}}!</h1><p>你的年龄是 {{age}} 岁</p>',
      data: { name: '用户', age: 25 },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: '产品列表',
      content: `
        <h2>产品列表</h2>
        {for products}
          <div>
            <h3>{{$value.name}}</h3>
            <p>价格: ¥{{$value.price}}</p>
          </div>
        {/for}
      `,
      data: {
        products: [
          { name: '苹果', price: 10 },
          { name: '香蕉', price: 8 }
        ]
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template)
    setCurrentView('editor')
  }

  const handleRender = (template: Template) => {
    setSelectedTemplate(template)
    setCurrentView('renderer')
  }

  const handleSave = async (template: Template) => {
    try {
      if (template.id) {
        // 更新逻辑
        console.log('更新模板:', template)
      } else {
        // 创建逻辑
        await createTemplate(template)
      }
      setCurrentView('list')
      setSelectedTemplate(null)
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  const handleCancel = () => {
    setCurrentView('list')
    setSelectedTemplate(null)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'editor':
        return (
          <TemplateEditor
            template={selectedTemplate || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )
      
      case 'renderer':
        return selectedTemplate ? (
          <TemplateRenderer
            template={selectedTemplate}
            data={selectedTemplate.data || {}}
            onRender={(result) => console.log('渲染结果:', result)}
            onError={(error) => console.error('渲染错误:', error)}
          />
        ) : null
      
      default:
        return (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <button onClick={() => setCurrentView('editor')}>
                创建新模板
              </button>
            </div>
            <TemplateList
              templates={templates.length > 0 ? templates : sampleTemplates}
              loading={loading}
              onEdit={handleEdit}
              onRender={handleRender}
              onDelete={(id) => console.log('删除模板:', id)}
            />
          </div>
        )
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1>Koa HTML Template Client</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('list')}
            disabled={currentView === 'list'}
          >
            模板列表
          </button>
          <button 
            onClick={() => setCurrentView('editor')}
            disabled={currentView === 'editor'}
            style={{ marginLeft: '8px' }}
          >
            新建模板
          </button>
        </nav>
      </header>
      
      <main>
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App 