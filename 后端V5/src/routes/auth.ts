import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import AuthService from '../services/authService.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';
import { RegisterRequest, LoginRequest } from '../types/index.js';

const router = Express.Router();

// 注册
router.post('/register', async (req: Express.Request, res: Express.Response) => {
  try {
    const { username, email, password, age, gender, resident_city } = req.body as RegisterRequest;

    // 验证必填字段
    if (!username || !email || !password || !age || !gender || !resident_city) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段',
        code: 400,
      });
    }

    // 验证格式
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: '邮箱格式不正确',
        code: 400,
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: '密码至少6个字符',
        code: 400,
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        error: '用户名长度3-30个字符',
        code: 400,
      });
    }

    const result = await AuthService.register({
      username,
      email,
      password,
      age,
      gender,
      resident_city,
    });

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
      code: 500,
    });
  }
});

// 登录
router.post('/login', async (req: Express.Request, res: Express.Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: '邮箱和密码不能为空',
        code: 400,
      });
    }

    const result = await AuthService.login({ email, password });
    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
      code: 500,
    });
  }
});

// 获取当前用户信息
router.get('/me', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({
        success: false,
        error: '未认证',
        code: 401,
      });
    }

    const user = await AuthService.getUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
        code: 404,
      });
    }

    // 移除密码哈希
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: userWithoutPassword,
      message: '获取成功',
    });
  } catch (error) {
    console.error('获取用户错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
      code: 500,
    });
  }
});

export default router;
