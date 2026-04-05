import Express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import MatchService from '../services/matchService.js';
import { getPaginationParams } from '../utils/pagination.js';
const router = Express.Router();
// 创建匹配
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const { user_b_id, pet_a_id, pet_b_id } = req.body;
        if (!user_b_id || !pet_a_id || !pet_b_id) {
            return res.status(400).json({ success: false, error: '缺少必填参数', code: 400 });
        }
        const result = await MatchService.createMatch(req.user.user_id, user_b_id, pet_a_id, pet_b_id);
        res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        console.error('创建匹配错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 获取用户的所有匹配
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.user_id) {
            return res.status(401).json({ success: false, error: '未认证', code: 401 });
        }
        const paginationParams = getPaginationParams(req.query);
        const result = await MatchService.getMatchesForUser(req.user.user_id, paginationParams.page, paginationParams.limit);
        res.json(result);
    }
    catch (error) {
        console.error('获取匹配错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
// 更新匹配状态
router.patch('/:matchId/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['matched', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: '无效的状态', code: 400 });
        }
        const result = await MatchService.updateMatchStatus(req.params.matchId, status);
        res.json(result);
    }
    catch (error) {
        console.error('更新匹配错误:', error);
        res.status(500).json({ success: false, error: '服务器错误', code: 500 });
    }
});
export default router;
//# sourceMappingURL=matches.js.map