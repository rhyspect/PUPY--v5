import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import MarketService from '../services/marketService.js';
import { getPaginationParams } from '../utils/pagination.js';

const router = Express.Router();

// 发布商品
router.post('/', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '未认证', code: 401 });
    }

    const { title, description, category, price, images, type, requirements, pet_id } = req.body;
    if (!title || !description || !category || !type || !images) {
      return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
    }

    const result = await MarketService.createProduct(req.user.user_id, {
      title,
      description,
      category,
      price,
      images,
      type,
      requirements,
      pet_id,
    });

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('发布商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 按分类获取商品
router.get('/category/:category', async (req: Express.Request, res: Express.Response) => {
  try {
    const paginationParams = getPaginationParams(req.query);
    const result = await MarketService.getProductsByCategory(
      req.params.category,
      paginationParams.page,
      paginationParams.limit,
    );

    res.json(result);
  } catch (error) {
    console.error('获取商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 搜索商品
router.get('/search', async (req: Express.Request, res: Express.Response) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, error: '缺少搜索关键词', code: 400 });
    }

    const paginationParams = getPaginationParams(req.query);
    const result = await MarketService.searchProducts(
      keyword as string,
      paginationParams.page,
      paginationParams.limit,
    );

    res.json(result);
  } catch (error) {
    console.error('搜索商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取卖家商品
router.get('/seller/:sellerId', async (req: Express.Request, res: Express.Response) => {
  try {
    const result = await MarketService.getSellerProducts(req.params.sellerId);
    res.json(result);
  } catch (error) {
    console.error('获取卖家商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 更新商品
router.put('/:productId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    const result = await MarketService.updateProduct(req.params.productId, req.body);
    res.json(result);
  } catch (error) {
    console.error('更新商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 删除商品
router.delete('/:productId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    const result = await MarketService.deleteProduct(req.params.productId);
    res.json(result);
  } catch (error) {
    console.error('删除商品错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

// 获取配种市集
router.get('/breeding/market', async (req: Express.Request, res: Express.Response) => {
  try {
    const paginationParams = getPaginationParams(req.query);
    const result = await MarketService.getBreedingMarket(
      paginationParams.page,
      paginationParams.limit,
    );

    res.json(result);
  } catch (error) {
    console.error('获取配种市集错误:', error);
    res.status(500).json({ success: false, error: '服务器错误', code: 500 });
  }
});

export default router;
