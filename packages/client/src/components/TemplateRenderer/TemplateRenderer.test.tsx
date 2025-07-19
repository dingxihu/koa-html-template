import React from 'react'
import { render } from '@testing-library/react'
import TemplateRenderer from './index'
import type { Template } from '../../types'

const mockTemplate: Template = {
  id: 1,
  name: '测试模板',
  content: '<h1>欢迎 {{name}}!</h1>',
  data: { name: '测试用户' },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

describe('TemplateRenderer', () => {
  it('应该能够渲染组件', () => {
    const { container } = render(<TemplateRenderer template={mockTemplate} />)
    expect(container).toBeTruthy()
  })

  it('应该渲染模板名称', () => {
    const { getByText } = render(<TemplateRenderer template={mockTemplate} />)
    expect(getByText(/测试模板/)).toBeTruthy()
  })
}) 