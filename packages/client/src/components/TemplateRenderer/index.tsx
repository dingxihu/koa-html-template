import React, { useEffect, useState } from 'react'
import { Card, Button, Alert, Spin } from 'antd'
import { useTemplateRenderer } from '../../hooks/useTemplateRenderer'
import { renderTemplate } from '../../utils/templateRenderer'
import type { TemplateRendererProps, TemplateRenderResult } from '../../types'

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  data = {},
  onRender,
  onError,
  templateId,
  templateName,
  autoRender = true,
  className = '',
}) => {
  const [renderResult, setRenderResult] = useState<TemplateRenderResult | null>(null)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { renderTemplate: serverRenderTemplate, renderByName } = useTemplateRenderer()

  // 客户端渲染函数
  const renderClientSide = async (): Promise<TemplateRenderResult> => {
    try {
      const result = renderTemplate(template.content, { ...template.data, ...data })
      return {
        success: true,
        content: result,
        data: { ...template.data, ...data }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染失败'
      return {
        success: false,
        error: errorMessage,
        data: { ...template.data, ...data }
      }
    }
  }

  // 服务端渲染函数
  const renderServerSide = async (): Promise<TemplateRenderResult> => {
    try {
      if (templateId) {
        return await serverRenderTemplate(templateId, data)
      } else if (templateName) {
        return await renderByName(templateName, data)
      } else {
        throw new Error('需要提供 templateId 或 templateName')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '服务端渲染失败'
      return {
        success: false,
        error: errorMessage,
        data: { ...template.data, ...data }
      }
    }
  }

  // 执行渲染
  const executeRender = async () => {
    setRendering(true)
    setError(null)

    try {
      let result: TemplateRenderResult

      // 优先使用服务端渲染（如果提供了 templateId 或 templateName）
      if (templateId || templateName) {
        result = await renderServerSide()
      } else {
        // 否则使用客户端渲染
        result = await renderClientSide()
      }

      setRenderResult(result)

      if (result.success) {
        onRender?.(result)
      } else {
        setError(result.error || '渲染失败')
        onError?.(result.error || '渲染失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染失败'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setRendering(false)
    }
  }

  // 自动渲染
  useEffect(() => {
    if (autoRender && template) {
      executeRender()
    }
  }, [template, data, autoRender])

  // 数据变化时重新渲染
  useEffect(() => {
    if (autoRender && template && !rendering) {
      executeRender()
    }
  }, [data])

  if (!template) {
    return (
      <Card className={className}>
        <Alert message="未提供模板" type="warning" showIcon />
      </Card>
    )
  }

  return (
    <Card 
      title={`模板: ${template.name}`}
      className={className}
      extra={
        <Button 
          onClick={executeRender} 
          loading={rendering}
          type="primary"
        >
          重新渲染
        </Button>
      }
    >
      {rendering && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在渲染...</p>
        </div>
      )}

      {error && (
        <Alert 
          message="渲染错误" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: '16px' }}
        />
      )}

      {renderResult?.success && renderResult.content && (
        <div 
          className="template-renderer-content"
          dangerouslySetInnerHTML={{ __html: renderResult.content }}
        />
      )}

      {!rendering && !error && !renderResult?.success && (
        <Alert 
          message="暂无渲染结果" 
          type="info" 
          showIcon 
        />
      )}
    </Card>
  )
}

export default TemplateRenderer 