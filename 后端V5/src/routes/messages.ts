import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import MessageService from '../services/messageService.js';
import { getPaginationParams } from '../utils/pagination.js';

const router = Express.Router();

// 获取或创建聊天室
router.post('/rooms', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const { user_b_id } = req.body;
    if (!user_b_id) {
      return res.status(400).json({ success: false, error: '缺少用户ID', code: 400 });
    }

    const result = await MessageService.getOrCreateChatRoom(req.user.user_id, user_b_id);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('创建聊天室错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取用户的聊天室列表
router.get('/rooms', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const paginationParams = getPaginationParams(req.query);
    const result = await MessageService.getUserChatRooms(
      req.user.user_id,
      paginationParams.page,
      paginationParams.limit,
    );

    res.json(result);
  } catch (error) {
    console.error('获取聊天室错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 发送消息
router.post(
  '/rooms/:chatRoomId/messages',
  authMiddleware,
  async (req: AuthRequest, res: Express.Response) => {
    try {
      if (!req.user?.user_id) {
        return res.status(401).json({ success: false, error: '未认证', code: 401 });
      }

      const { receiver_id, content } = req.body;
      if (!receiver_id || !content) {
        return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
      }

      const result = await MessageService.sendMessage(
        req.params.chatRoomId,
        req.user.user_id,
        receiver_id,
        content,
      );

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('发送消息错误:', error);
      res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
  },
);

// 获取聊天记录
router.get(
  '/rooms/:chatRoomId/messages',
  authMiddleware,
  async (req: AuthRequest, res: Express.Response) => {
    try {
      const paginationParams = getPaginationParams(req.query);
      const result = await MessageService.getChatMessages(
        req.params.chatRoomId,
        paginationParams.page,
        paginationParams.limit,
      );

      res.json(result);
    } catch (error) {
      console.error('获取消息错误:', error);
      res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
  },
);

export default router;
