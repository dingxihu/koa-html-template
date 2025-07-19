#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 隐藏密码输入
function hideInput() {
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
}

function showInput() {
  const stdin = process.stdin;
  stdin.setRawMode(false);
  stdin.pause();
}

function promptPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    hideInput();
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          // Enter key pressed
          showInput();
          process.stdout.write('\n');
          process.stdin.removeAllListeners('data');
          resolve(password);
          break;
        case '\u0003':
          // Ctrl+C
          showInput();
          process.stdout.write('\n');
          process.exit(0);
          break;
        case '\u007f':
        case '\b':
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function setDatabasePassword() {
  console.log('🔐 PostgreSQL 密码设置工具\n');
  
  // 读取当前配置
  const envPath = path.join(__dirname, '../.env');
  let currentUser = 'jericho';
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const userMatch = envContent.match(/DB_USER=(.+)/);
    if (userMatch) {
      currentUser = userMatch[1];
    }
  }
  
  console.log(`📍 当前数据库用户: ${currentUser}`);
  console.log('请选择操作：');
  console.log('1. 为现有用户设置密码');
  console.log('2. 创建新的数据库用户');
  console.log('3. 退出');
  
  const choice = await new Promise(resolve => {
    rl.question('\n请输入选择 (1-3): ', resolve);
  });
  
  try {
    switch (choice) {
      case '1':
        await setExistingUserPassword(currentUser);
        break;
      case '2':
        await createNewUser();
        break;
      case '3':
        console.log('👋 再见！');
        process.exit(0);
        break;
      default:
        console.log('❌ 无效选择');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    process.exit(1);
  }
}

async function setExistingUserPassword(username) {
  console.log(`\n🔑 为用户 ${username} 设置密码`);
  
  const password = await promptPassword('请输入新密码: ');
  const confirmPassword = await promptPassword('请确认密码: ');
  
  if (password !== confirmPassword) {
    console.log('❌ 密码不匹配！');
    process.exit(1);
  }
  
  if (password.length < 6) {
    console.log('❌ 密码长度至少需要6个字符！');
    process.exit(1);
  }
  
  // 设置密码
  console.log('🔄 正在设置密码...');
  const command = `psql -d postgres -c "ALTER USER ${username} WITH PASSWORD '${password}';"`;
  
  try {
    execSync(command, { stdio: 'pipe' });
    console.log('✅ 密码设置成功！');
    
    // 更新 .env 文件
    await updateEnvFile(username, password);
    
  } catch (error) {
    console.log('❌ 密码设置失败');
    console.log('💡 请确保你有管理员权限或者用户已存在');
    throw error;
  }
}

async function createNewUser() {
  console.log('\n👤 创建新的数据库用户');
  
  const username = await new Promise(resolve => {
    rl.question('用户名: ', resolve);
  });
  
  const password = await promptPassword('密码: ');
  const confirmPassword = await promptPassword('确认密码: ');
  
  if (password !== confirmPassword) {
    console.log('❌ 密码不匹配！');
    process.exit(1);
  }
  
  if (password.length < 6) {
    console.log('❌ 密码长度至少需要6个字符！');
    process.exit(1);
  }
  
  console.log('🔄 正在创建用户...');
  
  try {
    // 创建用户
    execSync(`psql -d postgres -c "CREATE USER ${username} WITH PASSWORD '${password}';"`, { stdio: 'pipe' });
    
    // 授予权限
    execSync(`psql -d postgres -c "ALTER USER ${username} CREATEDB;"`, { stdio: 'pipe' });
    execSync(`psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE koa_template_db TO ${username};" || true`, { stdio: 'pipe' });
    
    console.log('✅ 用户创建成功！');
    
    // 更新 .env 文件
    await updateEnvFile(username, password);
    
  } catch (error) {
    console.log('❌ 用户创建失败');
    console.log('💡 用户可能已存在或权限不足');
    throw error;
  }
}

async function updateEnvFile(username, password) {
  const envPath = path.join(__dirname, '../.env');
  
  console.log('📝 更新环境配置文件...');
  
  const envContent = `# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=koa_template_db
DB_USER=${username}
DB_PASSWORD=${password}

# 数据库连接池配置
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# 服务器配置
PORT=3000
NODE_ENV=development

# 模板引擎配置
TEMPLATE_CACHE=true
TEMPLATE_DEBUG=false
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 环境配置已更新');
  
  console.log('\n🎉 设置完成！');
  console.log('💡 你现在可以运行以下命令:');
  console.log('   npm run db:test      # 测试数据库连接');
  console.log('   npm run dev          # 启动开发服务器');
}

// 处理Ctrl+C
process.on('SIGINT', () => {
  showInput();
  console.log('\n👋 操作已取消');
  process.exit(0);
});

if (require.main === module) {
  setDatabasePassword().finally(() => {
    rl.close();
  });
} 