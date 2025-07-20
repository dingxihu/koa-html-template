import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type {
  Template,
  UseTemplateResult,
  UpdateTemplateRequest,
  TemplateRenderResult
} from '../types'

export function useTemplate(): UseTemplateResult {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplate = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await templateApi.getTemplate(id)
      console.log(222, response);

      if (response.success && response.data) {
        setTemplate(response.data)
      } else {
        setError(response.error || '获取模板失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取模板失败'
      setError(errorMessage)
      setTemplate(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTemplate = useCallback(async (id: number, data: UpdateTemplateRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await templateApi.updateTemplate(id, data)
      if (response.success && response.data) {
        setTemplate(response.data)
      } else {
        setError(response.error || '更新模板失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新模板失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTemplate = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await templateApi.deleteTemplate(id)
      if (response.success) {
        setTemplate(null)
      } else {
        setError(response.error || '删除模板失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除模板失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const renderTemplate = useCallback(async (id: number, data?: Record<string, any>): Promise<TemplateRenderResult> => {
    try {
      const response = await templateApi.renderTemplate(id, data)
      if (response.success && response.data) {
        return {
          success: true,
          content: response.data.content,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          error: response.error || '渲染失败',
          data: data
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '渲染失败',
        data: data
      }
    }
  }, [])

  const renderTemplateByName = useCallback(async (name: string, data?: Record<string, any>): Promise<TemplateRenderResult> => {
    try {
      const response = await templateApi.renderTemplateByName(name, data)
      if (response.success && response.data) {
        return {
          success: true,
          content: response.data.content,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          error: response.error || '渲染失败',
          data: data
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '渲染失败',
        data: data
      }
    }
  }, [])

  return {
    template,
    loading,
    error,
    fetchTemplate,
    updateTemplate,
    deleteTemplate,
    renderTemplate,
    renderTemplateByName
  }
} 