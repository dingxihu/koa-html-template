import React, { useState, useEffect } from 'react';
import { TemplateRendererProps } from '../types';
import { useTemplate } from '../hooks/useTemplate';

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  templateName,
  data = {},
  onRender,
  onError,
  autoRender = true,
  className = '',
}) => {
  const [renderedContent, setRenderedContent] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const { renderTemplate, renderTemplateByName } = useTemplate();

  const handleRender = async () => {
    if (!templateId && !templateName) {
      const error = 'Either templateId or templateName must be provided';
      onError?.(error);
      return;
    }

    setIsRendering(true);
    try {
      let result: string;
      
      if (templateId) {
        result = await renderTemplate(templateId, data);
      } else if (templateName) {
        result = await renderTemplateByName(templateName, data);
      } else {
        throw new Error('Template identifier is required');
      }

      setRenderedContent(result);
      onRender?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Render failed';
      onError?.(errorMessage);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (autoRender && (templateId || templateName)) {
      handleRender();
    }
  }, [templateId, templateName, data, autoRender]);

  if (isRendering) {
    return (
      <div className={`template-renderer template-renderer--loading ${className}`}>
        <div className="template-renderer__spinner">
          渲染中...
        </div>
      </div>
    );
  }

  return (
    <div className={`template-renderer ${className}`}>
      {!autoRender && (
        <div className="template-renderer__controls">
          <button 
            onClick={handleRender}
            disabled={isRendering || (!templateId && !templateName)}
            className="template-renderer__render-btn"
          >
            渲染模板
          </button>
        </div>
      )}
      
      {renderedContent && (
        <div 
          className="template-renderer__content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      )}
    </div>
  );
};

export default TemplateRenderer; 