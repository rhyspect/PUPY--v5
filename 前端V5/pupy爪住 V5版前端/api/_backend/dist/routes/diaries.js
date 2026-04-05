import Express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import DiaryService from '../services/diaryService.js';
import { getPaginationParams } from '../utils/pagination.js';
const router = Express.Router();
// 创建日记
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const { pet_id, title, content, images, mood, tags, is_public } = req.body;
        if (!pet_id || !title || !content) {
            return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
        }
        const result = await DiaryService.createDiary(req.user.user_id, pet_id, {
            title,
            content,
            images,
            mood,
            tags,
            is_public,
        });
        res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        console.error('创建日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 获取用户的日记
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const paginationParams = getPaginationParams(req.query);
        const result = await DiaryService.getUserDiaries(req.user.user_id, paginationParams.page, paginationParams.limit);
        res.json(result);
    }
    catch (error) {
        console.error('获取日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 获取公开日记
router.get('/public/feed', async (req, res) => {
    try {
        const paginationParams = getPaginationParams(req.query);
        const result = await DiaryService.getPublicDiaries(paginationParams.page, paginationParams.limit);
        res.json(result);
    }
    catch (error) {
        console.error('获取公开日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 获取单个日记
router.get('/:diaryId', async (req, res) => {
    try {
        const diary = await DiaryService.getDiaryById(req.params.diaryId);
        if (!diary) {
            return res.status(404).json({ success: false, error: '日记不存在', code: 404 });
        }
        res.json({ success: true, data: diary, message: '获取成功' });
    }
    catch (error) {
        console.error('获取日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 更新日记
router.put('/:diaryId', authMiddleware, async (req, res) => {
    try {
        const result = await DiaryService.updateDiary(req.params.diaryId, req.body);
        res.json(result);
    }
    catch (error) {
        console.error('更新日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 删除日记
router.delete('/:diaryId', authMiddleware, async (req, res) => {
    try {
        const result = await DiaryService.deleteDiary(req.params.diaryId);
        res.json(result);
    }
    catch (error) {
        console.error('删除日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 赞日记
router.post('/:diaryId/like', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const result = await DiaryService.likeDiary(req.params.diaryId, req.user.user_id);
        res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        console.error('赞日记错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 取消赞日记
router.delete('/:diaryId/like', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const result = await DiaryService.unlikeDiary(req.params.diaryId, req.user.user_id);
        res.json(result);
    }
    catch (error) {
        console.error('取消赞错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 添加评论
router.post('/:diaryId/comments', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, error: '评论内容不能为空', code: 400 });
        }
        const result = await DiaryService.addComment(req.params.diaryId, req.user.user_id, content);
        res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        console.error('添加评论错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 获取评论
router.get('/:diaryId/comments', async (req, res) => {
    try {
        const paginationParams = getPaginationParams(req.query);
        const result = await DiaryService.getComments(req.params.diaryId, paginationParams.page, paginationParams.limit);
        res.json(result);
    }
    catch (error) {
        console.error('获取评论错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
export default router;
//# sourceMappingURL=diaries.js.map