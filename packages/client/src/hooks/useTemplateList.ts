import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type { 
  Template, 
  UseTemplateListResult, 
  CreateTemplateRequest,
  UpdateTemplateRequest,
  PaginationParams 
} from '../types'

export function useTemplateList(): UseTemplateListResult {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async (params?: PaginationParams) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.getTemplates(params)
      if (response.success && response.data) {
        setTemplates(response.data)
      } else {
        setError(response.error || '获取模板列表失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取模板列表失败'
      setError(errorMessage)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createTemplate = useCallback(async (data: CreateTemplateRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.createTemplate(data)
      if (response.success && response.data) {
        setTemplates(prev => [...prev, response.data!])
      } else {
        setError(response.error || '创建模板失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建模板失败'
      setError(errorMessage)
      throw err
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
        setTemplates(prev => prev.map(t => t.id === id ? response.data! : t))
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
        setTemplates(prev => prev.filter(t => t.id !== id))
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

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
} 