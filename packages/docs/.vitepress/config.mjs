import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Koa HTML Template',
  description: '基于 Koa 的模板引擎，支持 TypeScript',
  base: '/koa-html-template/',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/dingxihu/koa-html-template' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '模板语法', link: '/guide/template-syntax' },
            { text: '配置选项', link: '/guide/configuration' },
            { text: '错误处理', link: '/guide/error-handling' }
          ]
        },
        {
          text: '高级用法',
          items: [
            { text: '性能优化', link: '/guide/performance' },
            { text: '测试', link: '/guide/testing' },
            { text: '部署', link: '/guide/deployment' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '核心 API', link: '/api/core' },
            { text: '服务器 API', link: '/api/server' },
            { text: '客户端 API', link: '/api/client' },
            { text: '共享类型', link: '/api/shared' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础示例', link: '/examples/basic' },
            { text: '高级示例', link: '/examples/advanced' },
            { text: '集成示例', link: '/examples/integration' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dingxihu/koa-html-template' }
    ],

    footer: {
      message: '基于 ISC 许可证发布',
      copyright: 'Copyright © 2024 Jericho'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true
  }
}) 