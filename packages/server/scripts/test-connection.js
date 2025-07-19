#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'koa_template_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 1,
    connectionTimeoutMillis: 5000,
  };

  console.log('🔍 测试数据库连接...');
  console.log('📍 配置信息:');
  console.log(`   主机: ${config.host}:${config.port}`);
  console.log(`   数据库: ${config.database}`);
  console.log(`   用户: ${config.user}`);

  const pool = new Pool(config);

  try {
    // 测试连接
    console.log('\n📡 正在连接...');
    const client = await pool.connect();
    
    // 测试查询
    console.log('✅ 连接成功！');
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('\n📊 数据库信息:');
    console.log(`   当前时间: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL 版本: ${result.rows[0].postgres_version.split(' ')[0]}`);

    // 检查表是否存在
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('\n📋 已存在的表:');
      tablesResult.rows.forEach(row => {
        console.log(`   • ${row.table_name}`);
      });
    } else {
      console.log('\n📋 数据库中还没有表，运行迁移来创建表');
    }

    client.release();
    console.log('\n🎉 数据库连接测试成功！');
    
  } catch (error) {
    console.error('\n❌ 连接失败:', error.message);
    console.log('\n🔧 故障排除建议:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('• PostgreSQL 服务未运行或端口错误');
    } else if (error.code === 'ENOTFOUND') {
      console.log('• 主机地址无法解析');
    } else if (error.message.includes('password authentication failed')) {
      console.log('• 用户名或密码错误');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('• 数据库不存在，请先创建数据库');
    } else {
      console.log('• 检查 .env 文件中的数据库配置');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = { testConnection }; 