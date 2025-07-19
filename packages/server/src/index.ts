import Koa from 'koa';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import koaHtmlTemplate from './template';
import templateRoutes from './routes/templates';
import { runMigrations } from './database/migrate';

// 加载环境变量
dotenv.config();

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser());

// 模板引擎中间件
app.use(koaHtmlTemplate('./templates'));

// API路由
app.use(templateRoutes.routes());
app.use(templateRoutes.allowedMethods());

// 健康检查
app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
    return;
  }
  await next();
});

// 错误处理
app.on('error', (err, ctx) => {
  console.error('Server error:', err, ctx);
});

// 启动服务器
async function startServer() {
  try {
    // 运行数据库迁移
    console.log('运行数据库迁移...');
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功！`);
      console.log(`📍 地址: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api/templates`);
      console.log(`💚 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

startServer();

export default app; 