import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type { Template, TemplateFormData, UseTemplateListResult } from '../types'

export function useTemplateList(): UseTemplateListResult {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async (params?: {
    limit?: number
    offset?: number
    search?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.getTemplates(params)
      setTemplates(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取模板列表失败'
      setError(errorMessage)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createTemplate = useCallback(async (data: TemplateFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.createTemplate(data)
      setTemplates(prev => [response.data, ...prev])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建模板失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTemplates = useCallback(async () => {
    await fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    refreshTemplates,
  }
} 