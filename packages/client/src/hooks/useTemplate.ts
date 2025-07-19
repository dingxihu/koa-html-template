import { useState, useCallback } from 'react'
import { templateApi } from '../services/templateApi'
import type { Template, UseTemplateResult } from '../types'

export function useTemplate(): UseTemplateResult {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplate = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.getTemplate(id)
      setTemplate(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取模板失败'
      setError(errorMessage)
      setTemplate(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTemplate = useCallback(async (id: number, data: Partial<Template>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await templateApi.updateTemplate(id, data)
      setTemplate(response.data)
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
      await templateApi.deleteTemplate(id)
      setTemplate(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除模板失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    template,
    loading,
    error,
    fetchTemplate,
    updateTemplate,
    deleteTemplate,
  }
} 