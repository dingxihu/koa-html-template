import { db } from '../database/connection';

export interface Template {
  id?: number;
  name: string;
  content: string;
  data?: any;
  created_at?: Date;
  updated_at?: Date;
}

export interface TemplateRender {
  id?: number;
  template_id: number;
  rendered_content: string;
  render_data?: any;
  rendered_at?: Date;
}

export class TemplateModel {
  // 创建模板
  static async create(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template> {
    const query = `
      INSERT INTO templates (name, content, data)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [template.name, template.content, JSON.stringify(template.data || {})];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // 根据ID查找模板
  static async findById(id: number): Promise<Template | null> {
    const query = 'SELECT * FROM templates WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  // 根据名称查找模板
  static async findByName(name: string): Promise<Template | null> {
    const query = 'SELECT * FROM templates WHERE name = $1';
    const result = await db.query(query, [name]);
    return result.rows[0] || null;
  }

  // 获取所有模板
  static async findAll(limit?: number, offset?: number): Promise<Template[]> {
    let query = 'SELECT * FROM templates ORDER BY created_at DESC';
    const values: (number | string)[] = [];
    
    if (limit !== undefined) {
      query += ' LIMIT $1';
      values.push(limit);
      
      if (offset !== undefined) {
        query += ' OFFSET $2';
        values.push(offset);
      }
    }
    
    const result = await db.query(query, values);
    return result.rows;
  }

  // 搜索模板
  static async search(searchTerm: string, limit?: number): Promise<Template[]> {
    let query = `
      SELECT * FROM templates 
      WHERE name ILIKE $1 OR content ILIKE $1 
      ORDER BY created_at DESC
    `;
    const values: (number | string)[] = [`%${searchTerm}%`];
    
    if (limit !== undefined) {
      query += ' LIMIT $2';
      values.push(limit);
    }
    
    const result = await db.query(query, values);
    return result.rows;
  }

  // 更新模板
  static async update(id: number, updates: Partial<Template>): Promise<Template | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(updates.content);
    }

    if (updates.data !== undefined) {
      fields.push(`data = $${paramCount++}`);
      values.push(JSON.stringify(updates.data));
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE templates 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  // 删除模板
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM templates WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // 记录渲染历史
  static async recordRender(render: Omit<TemplateRender, 'id' | 'rendered_at'>): Promise<TemplateRender> {
    const query = `
      INSERT INTO template_renders (template_id, rendered_content, render_data)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      render.template_id,
      render.rendered_content,
      JSON.stringify(render.render_data || {})
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // 获取模板的渲染历史
  static async getRenderHistory(templateId: number, limit: number = 10): Promise<TemplateRender[]> {
    const query = `
      SELECT * FROM template_renders 
      WHERE template_id = $1 
      ORDER BY rendered_at DESC 
      LIMIT $2
    `;
    const result = await db.query(query, [templateId, limit]);
    return result.rows;
  }

  // 获取统计信息
  static async getStats(): Promise<{
    totalTemplates: number;
    totalRenders: number;
    recentRenders: number;
  }> {
    const totalTemplatesQuery = 'SELECT COUNT(*) as count FROM templates';
    const totalRendersQuery = 'SELECT COUNT(*) as count FROM template_renders';
    const recentRendersQuery = `
      SELECT COUNT(*) as count FROM template_renders 
      WHERE rendered_at >= NOW() - INTERVAL '24 hours'
    `;

    const [totalTemplates, totalRenders, recentRenders] = await Promise.all([
      db.query(totalTemplatesQuery),
      db.query(totalRendersQuery),
      db.query(recentRendersQuery)
    ]);

    return {
      totalTemplates: parseInt(totalTemplates.rows[0].count),
      totalRenders: parseInt(totalRenders.rows[0].count),
      recentRenders: parseInt(recentRenders.rows[0].count)
    };
  }
} 