#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');

function getPostgreSQLCommands() {
  const platform = os.platform();
  
  switch (platform) {
    case 'darwin': // macOS
      return {
        status: 'brew services list | grep postgresql',
        start: 'brew services start postgresql',
        stop: 'brew services stop postgresql',
        restart: 'brew services restart postgresql',
        info: 'brew services info postgresql'
      };
    case 'linux':
      return {
        status: 'systemctl status postgresql',
        start: 'sudo systemctl start postgresql',
        stop: 'sudo systemctl stop postgresql',
        restart: 'sudo systemctl restart postgresql',
        info: 'systemctl show postgresql'
      };
    case 'win32': // Windows
      return {
        status: 'sc query postgresql',
        start: 'net start postgresql',
        stop: 'net stop postgresql',
        restart: 'net stop postgresql && net start postgresql',
        info: 'sc qc postgresql'
      };
    default:
      return null;
  }
}

async function managePostgreSQLService() {
  console.log('🐘 PostgreSQL 服务管理工具\n');
  
  const commands = getPostgreSQLCommands();
  if (!commands) {
    console.log('❌ 不支持的操作系统:', os.platform());
    process.exit(1);
  }

  console.log(`📟 检测到操作系统: ${os.platform()}`);
  console.log('🔍 检查 PostgreSQL 服务状态...\n');

  // 检查服务状态
  try {
    const output = execSync(commands.status, { encoding: 'utf8', stdio: 'pipe' });
    console.log('📊 服务状态:');
    console.log(output);
  } catch (error) {
    console.log('⚠️  无法获取服务状态，服务可能未安装或未配置');
  }

  // 显示操作菜单
  console.log('\n🎛️  可用操作:');
  console.log('1. 启动 PostgreSQL 服务');
  console.log('2. 停止 PostgreSQL 服务');
  console.log('3. 重启 PostgreSQL 服务');
  console.log('4. 查看服务信息');
  console.log('5. 查看数据库进程');
  console.log('6. 退出');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const choice = await new Promise(resolve => {
    rl.question('\n请选择操作 (1-6): ', resolve);
  });

  try {
    switch (choice) {
      case '1':
        console.log('🚀 启动 PostgreSQL 服务...');
        execSync(commands.start, { stdio: 'inherit' });
        console.log('✅ 服务启动命令已执行');
        break;
        
      case '2':
        console.log('🛑 停止 PostgreSQL 服务...');
        execSync(commands.stop, { stdio: 'inherit' });
        console.log('✅ 服务停止命令已执行');
        break;
        
      case '3':
        console.log('🔄 重启 PostgreSQL 服务...');
        execSync(commands.restart, { stdio: 'inherit' });
        console.log('✅ 服务重启命令已执行');
        break;
        
      case '4':
        console.log('ℹ️  查看服务信息...');
        try {
          const info = execSync(commands.info, { encoding: 'utf8' });
          console.log(info);
        } catch (error) {
          console.log('❌ 无法获取服务信息');
        }
        break;
        
      case '5':
        console.log('🔍 查看数据库进程...');
        try {
          const processes = execSync('ps aux | grep postgres | grep -v grep', { encoding: 'utf8' });
          if (processes.trim()) {
            console.log('📋 PostgreSQL 进程:');
            console.log(processes);
          } else {
            console.log('📭 没有发现 PostgreSQL 进程');
          }
        } catch (error) {
          console.log('❌ 无法查看进程信息');
        }
        break;
        
      case '6':
        console.log('👋 再见！');
        break;
        
      default:
        console.log('❌ 无效选择');
    }
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    console.log('\n💡 故障排除建议:');
    console.log('• 确保你有足够的权限执行服务管理命令');
    console.log('• 检查 PostgreSQL 是否已正确安装');
    console.log('• 在某些系统上可能需要使用 sudo');
  }

  rl.close();
}

// 检查 PostgreSQL 是否已安装
function checkPostgreSQLInstallation() {
  console.log('🔍 检查 PostgreSQL 安装...');
  
  try {
    const version = execSync('psql --version', { encoding: 'utf8' });
    console.log('✅ PostgreSQL 已安装:', version.trim());
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL 未安装或不在 PATH 中');
    console.log('\n📥 安装建议:');
    
    const platform = os.platform();
    switch (platform) {
      case 'darwin':
        console.log('  macOS: brew install postgresql');
        break;
      case 'linux':
        console.log('  Ubuntu/Debian: sudo apt-get install postgresql');
        console.log('  CentOS/RHEL: sudo yum install postgresql-server');
        break;
      case 'win32':
        console.log('  Windows: 从 https://www.postgresql.org/download/windows/ 下载安装包');
        break;
    }
    
    return false;
  }
}

if (require.main === module) {
  console.log('🐘 PostgreSQL 服务管理工具\n');
  
  if (checkPostgreSQLInstallation()) {
    managePostgreSQLService();
  } else {
    process.exit(1);
  }
}

module.exports = { managePostgreSQLService, checkPostgreSQLInstallation }; 