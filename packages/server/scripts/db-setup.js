#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查环境变量文件
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ 未找到 .env 文件');
  console.log('📝 请先复制 .env.example 到 .env 并配置数据库信息');
  process.exit(1);
}

// 读取环境变量
require('dotenv').config({ path: envPath });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'koa_template_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
};

console.log('🗄️  数据库配置检查...');
console.log(`📍 主机: ${dbConfig.host}:${dbConfig.port}`);
console.log(`🏷️  数据库: ${dbConfig.database}`);
console.log(`👤 用户: ${dbConfig.user}`);

if (!dbConfig.password) {
  console.log('⚠️  警告: 数据库密码为空');
}

async function setupDatabase() {
  try {
    console.log('\n🚀 开始数据库设置...');

    // 检查 PostgreSQL 连接
    console.log('📡 检查 PostgreSQL 连接...');
    const testConnection = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "SELECT version();"`;
    
    try {
      execSync(testConnection, { 
        stdio: 'pipe',
        env: { ...process.env, PGPASSWORD: dbConfig.password }
      });
      console.log('✅ PostgreSQL 连接正常');
    } catch (error) {
      console.log('❌ PostgreSQL 连接失败');
      console.log('💡 请确保:');
      console.log('   1. PostgreSQL 服务已启动');
      console.log('   2. 用户名和密码正确');
      console.log('   3. 主机和端口可访问');
      throw error;
    }

    // 创建数据库
    console.log('🏗️  创建数据库...');
    const createDbCommand = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "CREATE DATABASE ${dbConfig.database};"`;
    
    try {
      execSync(createDbCommand, { 
        stdio: 'pipe',
        env: { ...process.env, PGPASSWORD: dbConfig.password }
      });
      console.log(`✅ 数据库 ${dbConfig.database} 创建成功`);
    } catch (error) {
      // 数据库可能已存在
      console.log(`📌 数据库 ${dbConfig.database} 已存在或创建失败`);
    }

    // 运行迁移
    console.log('🔄 运行数据库迁移...');
    const migrationPath = path.join(__dirname, '../src/database/migrate.ts');
    execSync(`npx tsx ${migrationPath}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('\n🎉 数据库设置完成！');
    console.log('💡 你现在可以运行以下命令:');
    console.log('   npm run dev          # 启动开发服务器');
    console.log('   npm run db:migrate   # 运行数据库迁移');

  } catch (error) {
    console.error('\n❌ 数据库设置失败:', error.message);
    console.log('\n🔧 故障排除建议:');
    console.log('1. 检查 PostgreSQL 是否正在运行');
    console.log('2. 验证 .env 文件中的数据库配置');
    console.log('3. 确认数据库用户权限');
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 