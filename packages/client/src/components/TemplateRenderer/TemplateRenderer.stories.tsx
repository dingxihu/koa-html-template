import type { Meta, StoryObj } from '@storybook/react'
import TemplateRenderer from './index'

const meta: Meta<typeof TemplateRenderer> = {
  title: 'Components/TemplateRenderer',
  component: TemplateRenderer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onRender: { action: 'rendered' },
    onError: { action: 'error' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    template: {
      id: 1,
      name: '欢迎页面',
      content: '<h1>欢迎 {{name}}!</h1><p>你的年龄是 {{age}} 岁</p>',
      data: { name: '用户', age: 25 },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    data: { name: '张三', age: 30 },
  },
}

export const WithConditionalLogic: Story = {
  args: {
    template: {
      id: 2,
      name: '条件渲染示例',
      content: `
        <div>
          <h2>{{title}}</h2>
          {if user.isAdmin}
            <button>管理员面板</button>
          {/if}
          {if !user.isActive}
            <div style="color: red;">账户已禁用</div>
          {/if}
        </div>
      `,
      data: { title: '用户管理', user: { isAdmin: true, isActive: true } },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    data: { title: '系统管理', user: { isAdmin: true, isActive: false } },
  },
}

export const WithLoop: Story = {
  args: {
    template: {
      id: 3,
      name: '循环渲染示例',
      content: `
        <div>
          <h2>{{title}}</h2>
          <ul>
            {for users}
              <li>{{$value.name}} - {{$value.age}}岁 (索引: {{$index}})</li>
            {/for}
          </ul>
        </div>
      `,
      data: { title: '用户列表', users: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    data: { 
      title: '员工列表', 
      users: [
        { name: '张三', age: 25 },
        { name: '李四', age: 30 },
        { name: '王五', age: 28 }
      ] 
    },
  },
} 