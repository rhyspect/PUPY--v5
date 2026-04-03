import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import AiService from '../services/aiService.js';

const router = Express.Router();

// 创建祈祷记录 (AI Prayer)
router.post('/prayer', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const { pet_id, prayer_text } = req.body;
    if (!pet_id || !prayer_text) {
      return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
    }

    // 生成AI响应
    const aiResponse = await AiService.generateAIResponse('宠物', prayer_text, 'friendly');

    if (!aiResponse.success) {
      return res.status(500).json(aiResponse);
    }

    const result = await AiService.createPrayerRecord(
      req.user.user_id,
      pet_id,
      prayer_text,
      aiResponse.data?.response || '',
      aiResponse.data?.sentiment || 'neutral',
    );

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('创建祈祷记录错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取用户的祈祷记录
router.get('/prayer', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const result = await AiService.getUserPrayerRecords(req.user.user_id);
    res.json(result);
  } catch (error) {
    console.error('获取祈祷记录错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取未读通知
router.get('/notifications', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const result = await AiService.getUnreadNotifications(req.user.user_id);
    res.json(result);
  } catch (error) {
    console.error('获取通知错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 标记通知为已读
router.patch(
  '/notifications/:notificationId',
  authMiddleware,
  async (req: AuthRequest, res: Express.Response) => {
    try {
      const result = await AiService.markNotificationAsRead(req.params.notificationId);
      res.json(result);
    } catch (error) {
      console.error('标记通知错误:', error);
      res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
  },
);

export default router;
