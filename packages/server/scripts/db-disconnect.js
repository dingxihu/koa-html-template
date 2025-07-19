#!/usr/bin/env node

const { Pool } = require('pg');
const { execSync } = require('child_process');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function disconnectDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'koa_template_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 1,
    connectionTimeoutMillis: 5000,
  };

  console.log('🔌 数据库连接管理工具\n');
  console.log('📍 目标数据库配置:');
  console.log(`   主机: ${config.host}:${config.port}`);
  console.log(`   数据库: ${config.database}`);
  console.log(`   用户: ${config.user}\n`);

  const pool = new Pool(config);

  try {
    // 连接到数据库
    console.log('📡 连接到数据库...');
    const client = await pool.connect();

    // 查看当前活动连接
    console.log('🔍 检查当前活动连接...');
    const activeConnections = await client.query(`
      SELECT 
        pid,
        usename,
        application_name,
        client_addr,
        state,
        backend_start,
        state_change
      FROM pg_stat_activity 
      WHERE datname = $1 AND pid <> pg_backend_pid()
      ORDER BY backend_start DESC
    `, [config.database]);

    if (activeConnections.rows.length > 0) {
      console.log(`\n📊 发现 ${activeConnections.rows.length} 个活动连接:`);
      console.log('┌────────┬─────────────┬──────────────────┬─────────────┬───────────┐');
      console.log('│  PID   │   用户名    │    应用程序      │   客户端    │   状态    │');
      console.log('├────────┼─────────────┼──────────────────┼─────────────┼───────────┤');
      
      activeConnections.rows.forEach(row => {
        const pid = row.pid.toString().padEnd(6);
        const user = (row.usename || '').padEnd(11);
        const app = (row.application_name || '').substring(0, 16).padEnd(16);
        const client_addr = (row.client_addr || 'local').padEnd(11);
        const state = (row.state || '').padEnd(9);
        
        console.log(`│ ${pid} │ ${user} │ ${app} │ ${client_addr} │ ${state} │`);
      });
      console.log('└────────┴─────────────┴──────────────────┴─────────────┴───────────┘\n');

      // 询问是否要终止连接
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('❓ 是否要终止所有连接？(y/N): ', resolve);
      });

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('🔄 正在终止所有连接...');
        
        // 终止所有连接
        await client.query(`
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity 
          WHERE datname = $1 AND pid <> pg_backend_pid()
        `, [config.database]);

        console.log('✅ 所有连接已终止');
      } else {
        console.log('⏭️  跳过终止连接');
      }

      rl.close();
    } else {
      console.log('📭 没有发现其他活动连接');
    }

    client.release();

    // 检查数据库锁
    console.log('\n🔒 检查数据库锁...');
    const client2 = await pool.connect();
    const locks = await client2.query(`
      SELECT 
        l.locktype,
        l.database,
        l.relation,
        l.page,
        l.tuple,
        l.virtualxid,
        l.transactionid,
        l.classid,
        l.objid,
        l.objsubid,
        l.virtualtransaction,
        l.pid,
        l.mode,
        l.granted,
        a.usename,
        a.query,
        a.state
      FROM pg_locks l
      LEFT JOIN pg_stat_activity a ON l.pid = a.pid
      WHERE l.database = (SELECT oid FROM pg_database WHERE datname = $1)
      ORDER BY l.pid
    `, [config.database]);

    if (locks.rows.length > 0) {
      console.log(`🔐 发现 ${locks.rows.length} 个数据库锁`);
      
      const activeLocks = locks.rows.filter(lock => !lock.granted);
      if (activeLocks.length > 0) {
        console.log(`⚠️  其中 ${activeLocks.length} 个锁处于等待状态`);
      }
    } else {
      console.log('🔓 没有发现数据库锁');
    }

    client2.release();

    console.log('\n🎯 数据库状态检查完成');
    console.log('💡 如果需要完全重置数据库连接，你可以:');
    console.log('   1. 重启 PostgreSQL 服务');
    console.log('   2. 使用 npm run db:reset 重置数据库');
    console.log('   3. 检查应用程序是否正确关闭连接池');

  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 PostgreSQL 服务可能未运行');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 目标数据库不存在');
    } else {
      console.log('💡 请检查数据库配置和权限');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 添加优雅退出处理
process.on('SIGINT', () => {
  console.log('\n👋 操作已取消');
  process.exit(0);
});

if (require.main === module) {
  disconnectDatabase();
}

module.exports = { disconnectDatabase }; 