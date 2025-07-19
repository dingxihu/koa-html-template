import Router from 'koa-router';
import { Context } from 'koa';
import { TemplateModel } from '../models/Template';

const router = new Router({ prefix: '/api/templates' });

// 获取所有模板
router.get('/', async (ctx: Context) => {
  try {
    const { limit, offset, search } = ctx.query;
    let templates;

    if (search) {
      templates = await TemplateModel.search(
        search as string,
        limit ? parseInt(limit as string) : undefined
      );
    } else {
      templates = await TemplateModel.findAll(
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
    }

    ctx.body = {
      success: true,
      data: templates,
      pagination: {
        limit: limit ? parseInt(limit as string) : null,
        offset: offset ? parseInt(offset as string) : null,
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '获取模板列表失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 根据ID获取模板
router.get('/:id', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    const template = await TemplateModel.findById(id);

    if (!template) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: '模板不存在'
      };
      return;
    }

    ctx.body = {
      success: true,
      data: template
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '获取模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 创建新模板
router.post('/', async (ctx: Context) => {
  try {
    const { name, content, data } = ctx.request.body as any;

    if (!name || !content) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: '模板名称和内容不能为空'
      };
      return;
    }

    // 检查模板名称是否已存在
    const existingTemplate = await TemplateModel.findByName(name);
    if (existingTemplate) {
      ctx.status = 409;
      ctx.body = {
        success: false,
        error: '模板名称已存在'
      };
      return;
    }

    const template = await TemplateModel.create({
      name,
      content,
      data: data || {}
    });

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: template
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '创建模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 更新模板
router.put('/:id', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    const updates = ctx.request.body as any;

    const existingTemplate = await TemplateModel.findById(id);
    if (!existingTemplate) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: '模板不存在'
      };
      return;
    }

    // 如果更新名称，检查名称是否已被其他模板使用
    if (updates.name && updates.name !== existingTemplate.name) {
      const nameConflict = await TemplateModel.findByName(updates.name);
      if (nameConflict) {
        ctx.status = 409;
        ctx.body = {
          success: false,
          error: '模板名称已存在'
        };
        return;
      }
    }

    const updatedTemplate = await TemplateModel.update(id, updates);

    ctx.body = {
      success: true,
      data: updatedTemplate
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '更新模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 删除模板
router.delete('/:id', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    const deleted = await TemplateModel.delete(id);

    if (!deleted) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: '模板不存在'
      };
      return;
    }

    ctx.body = {
      success: true,
      message: '模板删除成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '删除模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 简单的模板渲染函数
function renderTemplate(template: string, data: any): string {
  return template
    .replace(/{-include([^{}]+)}/g, (match: string, key: string): string => {
      // 简化版include处理，这里可以根据需要扩展
      return match; // 暂时返回原样
    })
    .replace(/{{([^{}]+)}}/g, (match: string, key: string): string => {
      const value = data[key.trim()];
      return value !== undefined ? String(value) : '';
    })
    .replace(/{if([^{}]+)}([^{}]+){\/if}/g, (match: string, key1: string, key2: string): string => {
      if (data[key1.trim()]) {
        return key2.trim();
      }
      return '';
    })
    .replace(/{for([^{}]+)}([^{}]+){\/for}/g, (match: string, key1: string, key2: string): string => {
      const obj = data[key1.trim()];
      let s = '';
      
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        for (const o in obj) {
          s += key2.trim().replace(/{\$([^{}]+)}/g, (match: string, key: string): string => {
            if (key.trim() === 'key') {
              return String(o);
            }
            if (key.trim() === 'value') {
              return String(obj[o]);
            }
            return match;
          });
        }
        return s;
      }
      
      if (Array.isArray(obj)) {
        for (let i = 0, len = obj.length; i < len; i++) {
          s += key2.trim().replace(/{\$([^{}]+)}/g, (match: string, key: string): string => {
            if (key.trim() === 'index') {
              return String(i);
            }
            if (key.trim() === 'value') {
              return String(obj[i]);
            }
            if (/\./g.test(key.trim())) {
              const arr = key.trim().split('.');
              let ap: any = obj[i];
              for (let j = 1, len = arr.length; j < len; j++) {
                ap = ap[arr[j]];
              }
              return String(ap);
            }
            return match;
          });
        }
        return s;
      }
      
      return '';
    });
}

// 渲染模板
router.post('/:id/render', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    const renderData = ctx.request.body as any;

    const template = await TemplateModel.findById(id);
    if (!template) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: '模板不存在'
      };
      return;
    }

    // 合并模板默认数据和请求数据
    const mergedData = { ...template.data, ...renderData };

    // 使用简单的模板渲染
    const rendered = renderTemplate(template.content, mergedData);

    // 记录渲染历史
    await TemplateModel.recordRender({
      template_id: id,
      rendered_content: rendered,
      render_data: renderData
    });

    ctx.body = {
      success: true,
      data: {
        rendered_content: rendered,
        template_id: id,
        render_data: mergedData
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '渲染模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 根据名称渲染模板
router.post('/render/:name', async (ctx: Context) => {
  try {
    const name = ctx.params.name;
    const renderData = ctx.request.body as any;

    const template = await TemplateModel.findByName(name);
    if (!template) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: '模板不存在'
      };
      return;
    }

    // 合并模板默认数据和请求数据
    const mergedData = { ...template.data, ...renderData };

    // 使用简单的模板渲染
    const rendered = renderTemplate(template.content, mergedData);

    // 记录渲染历史
    await TemplateModel.recordRender({
      template_id: template.id!,
      rendered_content: rendered,
      render_data: renderData
    });

    ctx.body = {
      success: true,
      data: {
        rendered_content: rendered,
        template_id: template.id,
        render_data: mergedData
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '渲染模板失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 获取模板渲染历史
router.get('/:id/renders', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    const limit = ctx.query.limit ? parseInt(ctx.query.limit as string) : 10;

    const renders = await TemplateModel.getRenderHistory(id, limit);

    ctx.body = {
      success: true,
      data: renders
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '获取渲染历史失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// 获取统计信息
router.get('/stats/overview', async (ctx: Context) => {
  try {
    const stats = await TemplateModel.getStats();

    ctx.body = {
      success: true,
      data: stats
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '获取统计信息失败',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

export default router; 