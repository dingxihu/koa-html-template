import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type { TemplateRenderResult, UseTemplateRendererResult } from '../types'

export function useTemplateRenderer(): UseTemplateRendererResult {
  const [renderResult, setRenderResult] = useState<TemplateRenderResult | null>(null)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const renderTemplate = useCallback(async (templateId: number, data?: Record<string, any>) => {
    setRendering(true)
    setError(null)
    
    try {
      const response = await templateApi.renderTemplate(templateId, data)
      setRenderResult(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染模板失败'
      setError(errorMessage)
      setRenderResult(null)
    } finally {
      setRendering(false)
    }
  }, [])

  const renderByName = useCallback(async (name: string, data?: Record<string, any>) => {
    setRendering(true)
    setError(null)
    
    try {
      const response = await templateApi.renderTemplateByName(name, data)
      setRenderResult(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染模板失败'
      setError(errorMessage)
      setRenderResult(null)
    } finally {
      setRendering(false)
    }
  }, [])

  return {
    renderResult,
    rendering,
    error,
    renderTemplate,
    renderByName,
  }
} 