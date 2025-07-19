import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type { 
  UseTemplateRendererResult, 
  TemplateRenderResult 
} from '../types'

export function useTemplateRenderer(): UseTemplateRendererResult {
  const [renderResult, setRenderResult] = useState<TemplateRenderResult | null>(null)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const renderTemplate = useCallback(async (id: number, data?: Record<string, any>): Promise<TemplateRenderResult> => {
    setRendering(true)
    setError(null)
    
    try {
      const response = await templateApi.renderTemplate(id, data)
      if (response.success && response.data) {
        const result: TemplateRenderResult = {
          success: true,
          content: response.data.content,
          data: response.data.data
        }
        setRenderResult(result)
        return result
      } else {
        const errorMessage = response.error || '渲染失败'
        const result: TemplateRenderResult = {
          success: false,
          error: errorMessage,
          data: data
        }
        setError(errorMessage)
        setRenderResult(result)
        return result
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染失败'
      const result: TemplateRenderResult = {
        success: false,
        error: errorMessage,
        data: data
      }
      setError(errorMessage)
      setRenderResult(result)
      return result
    } finally {
      setRendering(false)
    }
  }, [])

  const renderByName = useCallback(async (name: string, data?: Record<string, any>): Promise<TemplateRenderResult> => {
    setRendering(true)
    setError(null)
    
    try {
      const response = await templateApi.renderTemplateByName(name, data)
      if (response.success && response.data) {
        const result: TemplateRenderResult = {
          success: true,
          content: response.data.content,
          data: response.data.data
        }
        setRenderResult(result)
        return result
      } else {
        const errorMessage = response.error || '渲染失败'
        const result: TemplateRenderResult = {
          success: false,
          error: errorMessage,
          data: data
        }
        setError(errorMessage)
        setRenderResult(result)
        return result
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '渲染失败'
      const result: TemplateRenderResult = {
        success: false,
        error: errorMessage,
        data: data
      }
      setError(errorMessage)
      setRenderResult(result)
      return result
    } finally {
      setRendering(false)
    }
  }, [])

  return {
    renderResult,
    rendering,
    error,
    renderTemplate,
    renderByName
  }
} 