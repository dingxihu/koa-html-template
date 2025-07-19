import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateRenderer from '../components/TemplateRenderer';
import { useTemplate } from '../hooks/useTemplate';

// Mock useTemplate hook
jest.mock('../hooks/useTemplate');
const mockUseTemplate = useTemplate as jest.MockedFunction<typeof useTemplate>;

describe('TemplateRenderer', () => {
  const mockRenderTemplate = jest.fn();
  const mockRenderTemplateByName = jest.fn();

  beforeEach(() => {
    mockUseTemplate.mockReturnValue({
      loading: false,
      error: null,
      clearError: jest.fn(),
      renderTemplate: mockRenderTemplate,
      renderTemplateByName: mockRenderTemplateByName,
      getTemplate: jest.fn(),
      getTemplateByName: jest.fn(),
      createTemplate: jest.fn(),
      updateTemplate: jest.fn(),
      deleteTemplate: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        autoRender={false}
      />
    );

    const renderButton = screen.getByText('渲染模板');
    expect(renderButton).toBeInTheDocument();
  });

  it('auto-renders template by ID on mount', async () => {
    mockRenderTemplate.mockResolvedValueOnce('<h1>Hello Test</h1>');

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        autoRender={true}
      />
    );

    await waitFor(() => {
      expect(mockRenderTemplate).toHaveBeenCalledWith(1, { name: 'Test' });
    });
  });

  it('auto-renders template by name on mount', async () => {
    mockRenderTemplateByName.mockResolvedValueOnce('<h1>Hello Test</h1>');

    render(
      <TemplateRenderer 
        templateName="test-template" 
        data={{ name: 'Test' }}
        autoRender={true}
      />
    );

    await waitFor(() => {
      expect(mockRenderTemplateByName).toHaveBeenCalledWith('test-template', { name: 'Test' });
    });
  });

  it('renders content after successful render', async () => {
    mockRenderTemplate.mockResolvedValueOnce('<h1>Hello Test</h1>');

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        autoRender={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Hello Test')).toBeInTheDocument();
    });
  });

  it('calls onRender callback with result', async () => {
    const onRender = jest.fn();
    mockRenderTemplate.mockResolvedValueOnce('<h1>Hello Test</h1>');

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        onRender={onRender}
        autoRender={true}
      />
    );

    await waitFor(() => {
      expect(onRender).toHaveBeenCalledWith('<h1>Hello Test</h1>');
    });
  });

  it('calls onError callback when render fails', async () => {
    const onError = jest.fn();
    mockRenderTemplate.mockRejectedValueOnce(new Error('Render failed'));

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        onError={onError}
        autoRender={true}
      />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Render failed');
    });
  });

  it('manual render works correctly', async () => {
    mockRenderTemplate.mockResolvedValueOnce('<h1>Manual Render</h1>');

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        autoRender={false}
      />
    );

    const renderButton = screen.getByText('渲染模板');
    fireEvent.click(renderButton);

    await waitFor(() => {
      expect(mockRenderTemplate).toHaveBeenCalledWith(1, { name: 'Test' });
    });

    await waitFor(() => {
      expect(screen.getByText('Manual Render')).toBeInTheDocument();
    });
  });

  it('disables render button when no template identifier provided', () => {
    render(
      <TemplateRenderer 
        data={{ name: 'Test' }}
        autoRender={false}
      />
    );

    const renderButton = screen.getByText('渲染模板');
    expect(renderButton).toBeDisabled();
  });

  it('shows loading state during render', async () => {
    mockRenderTemplate.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('<h1>Test</h1>'), 100)));

    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        autoRender={false}
      />
    );

    const renderButton = screen.getByText('渲染模板');
    fireEvent.click(renderButton);

    // Should show loading state
    expect(screen.getByText('渲染中...')).toBeInTheDocument();

    // Wait for render to complete
    await waitFor(() => {
      expect(screen.queryByText('渲染中...')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(
      <TemplateRenderer 
        templateId={1} 
        data={{ name: 'Test' }}
        className="custom-class"
        autoRender={false}
      />
    );

    const container = document.querySelector('.template-renderer.custom-class');
    expect(container).toBeInTheDocument();
  });
}); 