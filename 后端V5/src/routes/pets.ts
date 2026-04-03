import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import PetService from '../services/petService.js';
import { CreatePetRequest } from '../types/index.js';

const router = Express.Router();

// 创建宠物
router.post('/', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const petData = req.body as CreatePetRequest;
    const result = await PetService.createPet(req.user.user_id, petData);

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('创建宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取用户的所有宠物
router.get('/', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const result = await PetService.getPetsByUserId(req.user.user_id);
    res.json(result);
  } catch (error) {
    console.error('获取宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取单个宠物
router.get('/:petId', async (req: Express.Request, res: Express.Response) => {
  try {
    const pet = await PetService.getPetById(req.params.petId);
    if (!pet) {
      return res.status(404).json({ success: false, error: '宠物不存在', code: 404 });
    }

    res.json({ success: true, data: pet, message: '获取成功' });
  } catch (error) {
    console.error('获取宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 更新宠物
router.put('/:petId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    const result = await PetService.updatePet(req.params.petId, req.body);
    res.json(result);
  } catch (error) {
    console.error('更新宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 删除宠物
router.delete('/:petId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    const result = await PetService.deletePet(req.params.petId);
    res.json(result);
  } catch (error) {
    console.error('删除宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 创建数字分身
router.post(
  '/:petId/digital-twin',
  authMiddleware,
  async (req: AuthRequest, res: Express.Response) => {
    try {
      const { modelUrl, aiPersonality } = req.body;
      const result = await PetService.createDigitalTwin(
        req.params.petId,
        modelUrl,
        aiPersonality,
      );

      res.json(result);
    } catch (error) {
      console.error('创建数字分身错误:', error);
      res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
  },
);

// 获取可用配种宠物
router.get('/breeding/available', async (req: Express.Request, res: Express.Response) => {
  try {
    const { type, gender, limit = '20', offset = '0' } = req.query;

    if (!type || !gender) {
      return res
        .status(400)
        .json({ success: false, error: '缺少必填参数', code: 400 });
    }

    const result = await PetService.getBreedingPets(
      type as string,
      gender as string,
      parseInt(limit as string),
      parseInt(offset as string),
    );

    res.json(result);
  } catch (error) {
    console.error('获取配种宠物错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

export default router;
