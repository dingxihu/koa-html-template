/**
 * 客户端模板渲染工具
 * 提供简单的客户端模板解析功能
 */

export interface RenderOptions {
  escapeHtml?: boolean
  throwOnError?: boolean
}

/**
 * HTML 转义函数
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

/**
 * 获取嵌套对象的值
 */
function getValue(path: string, data: Record<string, any>): any {
  const keys = path.split('.')
  let value = data

  for (const key of keys) {
    if (value == null) return undefined
    value = value[key]
  }

  return value
}

/**
 * 简单的客户端模板渲染
 * 支持基础的变量替换，用于预览等场景
 */
export function renderTemplate(
  template: string,
  data: Record<string, any> = {},
  options: RenderOptions = {}
): string {
  const { escapeHtml: shouldEscape = true, throwOnError = false } = options

  try {
    let result = template

    // 移除注释
    result = result.replace(/\{#[\s\S]*?#\}/g, '')

    // 处理三重大括号（不转义）
    result = result.replace(/\{\{\{([^}]+)\}\}\}/g, (match, varName) => {
      const value = getValue(varName.trim(), data)
      return String(value ?? '')
    })

    // 处理双重大括号（转义）
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const value = getValue(varName.trim(), data)
      const stringValue = String(value ?? '')
      return shouldEscape ? escapeHtml(stringValue) : stringValue
    })

    // 简单的条件处理
    result = result.replace(/\{if\s+([^}]+)\}([\s\S]*?)\{\/if\}/g, (match, condition, content) => {
      const value = getValue(condition.trim(), data)
      return value ? content : ''
    })

    // 简单的循环处理
    result = result.replace(/\{for\s+([^}]+)\}([\s\S]*?)\{\/for\}/g, (match, arrayName, content) => {
      const arrayData = getValue(arrayName.trim(), data)
      
      if (!Array.isArray(arrayData)) {
        return ''
      }

      return arrayData.map((item, index) => {
        return content
          .replace(/\{\$index\}/g, index.toString())
          .replace(/\{\$value\.([^}]+)\}/g, (_match: string, prop: string) => {
            const value = getValue(prop, item)
            return shouldEscape ? escapeHtml(String(value ?? '')) : String(value ?? '')
          })
          .replace(/\{\$value\}/g, shouldEscape ? escapeHtml(String(item)) : String(item))
      }).join('')
    })

    return result
  } catch (error) {
    if (throwOnError) {
      throw error
    }
    
    console.warn('Template rendering error:', error)
    return template // 返回原始模板
  }
}

/**
 * 验证模板语法
 */
export function validateTemplate(template: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 检查括号匹配
  const braceMatches = template.match(/\{\{[^}]*\}\}/g) || []
  const tripleBraceMatches = template.match(/\{\{\{[^}]*\}\}\}/g) || []
  
  // 检查条件语句
  const ifMatches = template.match(/\{if[^}]*\}/g) || []
  const endIfMatches = template.match(/\{\/if\}/g) || []
  
  if (ifMatches.length !== endIfMatches.length) {
    errors.push('if 语句不匹配：缺少对应的 {/if}')
  }

  // 检查循环语句
  const forMatches = template.match(/\{for[^}]*\}/g) || []
  const endForMatches = template.match(/\{\/for\}/g) || []
  
  if (forMatches.length !== endForMatches.length) {
    errors.push('for 语句不匹配：缺少对应的 {/for}')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 提取模板中使用的变量
 */
export function extractVariables(template: string): string[] {
  const variables = new Set<string>()
  
  // 提取 {{variable}} 和 {{{variable}}} 中的变量
  const matches = template.match(/\{\{\{?([^}]+)\}?\}\}/g) || []
  
  matches.forEach(match => {
    const varName = match.replace(/\{+|\}+/g, '').trim()
    if (varName && !varName.startsWith('$')) {
      variables.add(varName)
    }
  })

  return Array.from(variables)
} 