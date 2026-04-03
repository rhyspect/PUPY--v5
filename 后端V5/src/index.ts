import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import config from './config/index.js';
import errorHandler, { corsOptions } from './middleware/errorHandler.js';

// 路由导入
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import diaryRoutes from './routes/diaries.js';
import marketRoutes from './routes/market.js';
import breedingRoutes from './routes/breeding.js';
import aiRoutes from './routes/ai.js';

const app: Express = express();

// 中间件
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'PUPY后端服务正常运行',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API 版本信息
app.get('/api/version', (req: Request, res: Response) => {
  res.json({
    success: true,
    version: '1.0.0',
    name: 'PUPY (爪住) Backend API',
    description: '宠物社交平台 | Pet Social Platform',
  });
});

// 路由挂载
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/breeding', breedingRoutes);
app.use('/api/ai', aiRoutes);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: '端点不存在',
    code: 404,
    path: req.path,
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✨ PUPY 后端服务启动成功！`);
  console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${config.nodeEnv}`);
  console.log(`📝 API版本: v1.0.0`);
});

export default app;
