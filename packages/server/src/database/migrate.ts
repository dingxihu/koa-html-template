import { db } from './connection';

export const migrations = [
  {
    name: '001_create_templates_table',
    up: `
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_templates_name ON templates(name);
      CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at);
    `,
    down: `
      DROP TABLE IF EXISTS templates;
    `
  },
  {
    name: '002_create_template_renders_table',
    up: `
      CREATE TABLE IF NOT EXISTS template_renders (
        id SERIAL PRIMARY KEY,
        template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
        rendered_content TEXT NOT NULL,
        render_data JSONB DEFAULT '{}',
        rendered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_template_renders_template_id ON template_renders(template_id);
      CREATE INDEX IF NOT EXISTS idx_template_renders_rendered_at ON template_renders(rendered_at);
    `,
    down: `
      DROP TABLE IF EXISTS template_renders;
    `
  }
];

export async function runMigrations(): Promise<void> {
  try {
    // 创建migrations表来跟踪迁移
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('开始数据库迁移...');

    for (const migration of migrations) {
      // 检查迁移是否已执行
      const result = await db.query('SELECT id FROM migrations WHERE name = $1', [migration.name]);
      
      if (result.rows.length === 0) {
        console.log(`执行迁移: ${migration.name}`);
        
        await db.transaction(async (query) => {
          await query(migration.up);
          await query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
        });
        
        console.log(`迁移完成: ${migration.name}`);
      } else {
        console.log(`跳过已执行的迁移: ${migration.name}`);
      }
    }

    console.log('所有迁移已完成！');
  } catch (error) {
    console.error('迁移失败:', error);
    throw error;
  }
}

export async function rollbackMigration(migrationName: string): Promise<void> {
  try {
    const migration = migrations.find(m => m.name === migrationName);
    if (!migration) {
      throw new Error(`未找到迁移: ${migrationName}`);
    }

    console.log(`回滚迁移: ${migrationName}`);
    
    await db.transaction(async (query) => {
      await query(migration.down);
      await query('DELETE FROM migrations WHERE name = $1', [migrationName]);
    });
    
    console.log(`回滚完成: ${migrationName}`);
  } catch (error) {
    console.error('回滚失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，执行迁移
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('迁移脚本执行失败:', error);
      process.exit(1);
    });
} 