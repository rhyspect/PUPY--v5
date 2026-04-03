import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import BreedingService from '../services/breedingService.js';
import { getPaginationParams } from '../utils/pagination.js';

const router = Express.Router();

// 创建配种请求
router.post('/', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const { receiver_id, sender_pet_id, receiver_pet_id, notes } = req.body;
    if (!receiver_id || !sender_pet_id || !receiver_pet_id) {
      return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
    }

    const result = await BreedingService.createBreedingRequest(
      req.user.user_id,
      sender_pet_id,
      receiver_id,
      receiver_pet_id,
      notes,
    );

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('创建配种请求错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取配种请求列表
router.get('/', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const paginationParams = getPaginationParams(req.query);
    const result = await BreedingService.getBreedingRequestsForUser(
      req.user.user_id,
      paginationParams.page,
      paginationParams.limit,
    );

    res.json(result);
  } catch (error) {
    console.error('获取配种请求错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 更新配种请求状态
router.patch(
  '/:requestId/status',
  authMiddleware,
  async (req: AuthRequest, res: Express.Response) => {
    try {
      const { status } = req.body;
      if (!status || !['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ success: false, error: '无效的状态', code: 400 });
      }

      const result = await BreedingService.updateBreedingRequestStatus(
        req.params.requestId,
        status,
      );
      res.json(result);
    } catch (error) {
      console.error('更新配种请求错误:', error);
      res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
  },
);

export default router;
