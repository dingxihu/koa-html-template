#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// 确保正确加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'koa_template_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  };
}

function executeDbCommand(command, database = 'postgres') {
  const config = getDbConfig();
  
  console.log('📍 数据库配置:');
  console.log(`   主机: ${config.host}:${config.port}`);
  console.log(`   目标数据库: ${database}`);
  console.log(`   用户: ${config.user}`);
  console.log(`   命令: ${command}\n`);

  const psqlCommand = `psql -h ${config.host} -p ${config.port} -U ${config.user} -d ${database} -c "${command}"`;
  
  const env = {
    ...process.env,
    PGPASSWORD: config.password
  };

  try {
    console.log('🔄 执行命令...');
    const result = execSync(psqlCommand, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      env: env
    });
    
    console.log('✅ 命令执行成功:');
    console.log(result);
    return true;
  } catch (error) {
    console.error('❌ 命令执行失败:', error.message);
    
    if (error.message.includes('connection') || error.message.includes('连接')) {
      console.log('\n🔧 连接故障排除:');
      console.log('1. 检查 PostgreSQL 服务是否运行: npm run db:service');
      console.log('2. 验证数据库配置: npm run db:test');
      console.log('3. 检查网络连接和防火墙设置');
    }
    
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('❌ 缺少命令参数');
    console.log('用法: node db-commands.js <command> [database]');
    console.log('示例:');
    console.log('  node db-commands.js "DROP DATABASE IF EXISTS koa_template_db"');
    console.log('  node db-commands.js "CREATE DATABASE koa_template_db"');
    process.exit(1);
  }

  const command = args[0];
  const database = args[1] || 'postgres';
  
  console.log('🗄️  数据库命令执行工具\n');
  
  const success = executeDbCommand(command, database);
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { executeDbCommand, getDbConfig }; 