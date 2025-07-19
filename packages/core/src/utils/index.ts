/**
 * 转义HTML字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * 深度获取对象属性值
 */
export function getValue(path: string, obj: any): any {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value == null) return undefined;
    value = value[key];
  }

  return value;
}

/**
 * 检查值是否为真值
 */
export function isTruthy(value: any): boolean {
  return Boolean(value);
}

/**
 * 格式化模板错误信息
 */
export function formatTemplateError(error: Error, template?: string, line?: number): string {
  let message = error.message;
  
  if (template && line) {
    message += `\nTemplate: ${template}\nLine: ${line}`;
  }
  
  return message;
}

/**
 * 标准化文件路径
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
} 