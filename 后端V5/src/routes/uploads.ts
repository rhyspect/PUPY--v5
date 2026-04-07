import Express from 'express';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import { uploadImageDataUrl } from '../services/uploadService.js';

const router = Express.Router();

router.post('/image', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ success: false, error: '请先登录后再上传图片。', code: 401 });
    }

    const { dataUrl, fileName, contentType, folder } = req.body as {
      dataUrl?: string;
      fileName?: string;
      contentType?: string;
      folder?: string;
    };

    if (!dataUrl) {
      return res.status(400).json({ success: false, error: '缺少图片内容。', code: 400 });
    }

    const asset = await uploadImageDataUrl({
      userId: req.user.user_id,
      dataUrl,
      fileName,
      contentType,
      folder,
    });

    res.status(201).json({
      success: true,
      data: asset,
      message: '图片已上传并同步到云端存储。',
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '图片上传失败，请稍后重试。',
      code: 400,
    });
  }
});

export default router;
