import React, { useState } from 'react'
import TemplateRenderer from '../components/TemplateRenderer'
import TemplateList from '../components/TemplateList'
import TemplateEditor from '../components/TemplateEditor'
import { useTemplateList } from '../hooks/useTemplateList'
import type { Template } from '../types'

const DemoPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'demo' | 'editor' | 'renderer'>('demo')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  
  const { templates, loading, createTemplate } = useTemplateList()

  // 演示模板数据
  const demoTemplates: Template[] = [
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
          <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
            <h3>{{$value.name}}</h3>
            <p>价格: ¥{{$value.price}}</p>
            <p>描述: {{$value.description}}</p>
          </div>
        {/for}
      `,
      data: {
        products: [
          { name: '苹果', price: 10, description: '新鲜红苹果' },
          { name: '香蕉', price: 8, description: '香甜黄香蕉' },
          { name: '橙子', price: 12, description: '酸甜可口橙子' }
        ]
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      name: '用户管理',
      content: `
        <div>
          <h2>{{title}}</h2>
          {if user.isAdmin}
            <div style="background: #e6f7ff; padding: 10px; border: 1px solid #91d5ff;">
              <h3>管理员功能</h3>
              <button>用户管理</button>
              <button>系统设置</button>
            </div>
          {/if}
          {if !user.isActive}
            <div style="background: #fff2e8; padding: 10px; border: 1px solid #ffbb96; color: #d4380d;">
              账户已禁用，请联系管理员
            </div>
          {/if}
          <p>用户名: {{user.name}}</p>
          <p>角色: {{user.role}}</p>
        </div>
      `,
      data: { 
        title: '用户信息', 
        user: { name: '管理员', role: 'admin', isAdmin: true, isActive: true } 
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
      await createTemplate(template)
      setCurrentView('demo')
      setSelectedTemplate(null)
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  const handleCancel = () => {
    setCurrentView('demo')
    setSelectedTemplate(null)
  }

  const renderDemoView = () => (
    <div>
      <h2>🎯 组件演示</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>📝 模板渲染器演示</h3>
        <TemplateRenderer
          template={demoTemplates[0]}
          data={{ name: '张三', age: 30 }}
          onRender={(result) => console.log('渲染结果:', result)}
          onError={(error) => console.error('渲染错误:', error)}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>🔄 条件渲染演示</h3>
        <TemplateRenderer
          template={demoTemplates[2]}
          data={{ 
            title: '系统管理', 
            user: { name: '李四', role: 'user', isAdmin: false, isActive: false } 
          }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>📋 模板列表演示</h3>
        <TemplateList
          templates={templates.length > 0 ? templates : demoTemplates}
          loading={loading}
          onEdit={handleEdit}
          onRender={handleRender}
          onDelete={(id) => console.log('删除模板:', id)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentView('editor')}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          创建新模板
        </button>
      </div>
    </div>
  )

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
          <div>
            <button 
              onClick={() => setCurrentView('demo')}
              style={{ 
                padding: '8px 16px', 
                marginBottom: '20px',
                backgroundColor: '#f0f0f0', 
                border: '1px solid #d9d9d9', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← 返回演示
            </button>
            <TemplateRenderer
              template={selectedTemplate}
              data={selectedTemplate.data || {}}
              onRender={(result) => console.log('渲染结果:', result)}
              onError={(error) => console.error('渲染错误:', error)}
            />
          </div>
        ) : null
      
      default:
        return renderDemoView()
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{ 
        marginBottom: '30px', 
        paddingBottom: '20px', 
        borderBottom: '2px solid #f0f0f0' 
      }}>
        <h1 style={{ color: '#1890ff', marginBottom: '10px' }}>
          🚀 Koa HTML Template Client Demo
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          基于 React 18 和 Ant Design 5 的模板引擎客户端组件库演示
        </p>
      </header>
      
      <main>
        {renderCurrentView()}
      </main>

      <footer style={{ 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
        color: '#999'
      }}>
        <p>© 2024 Koa HTML Template. 基于 React 18 + TypeScript + Ant Design 5 构建</p>
      </footer>
    </div>
  )
}

export default DemoPage 