import { useState, useCallback } from 'react';
import { templateApi } from '../api';
import { Template, CreateTemplateRequest, UpdateTemplateRequest, RenderTemplateRequest } from '../types';

export const useTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const renderTemplate = useCallback(async (id: number, data: RenderTemplateRequest): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateApi.renderTemplate(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const renderTemplateByName = useCallback(async (name: string, data: RenderTemplateRequest): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateApi.renderTemplateByName(name, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplate = useCallback(async (id: number): Promise<Template> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templateApi.getTemplate(id);
      return template;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplateByName = useCallback(async (name: string): Promise<Template> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templateApi.getTemplateByName(name);
      return template;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (template: CreateTemplateRequest): Promise<Template> => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateApi.createTemplate(template);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: number, updates: UpdateTemplateRequest): Promise<Template> => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateApi.updateTemplate(id, updates);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await templateApi.deleteTemplate(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    renderTemplate,
    renderTemplateByName,
    getTemplate,
    getTemplateByName,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}; 