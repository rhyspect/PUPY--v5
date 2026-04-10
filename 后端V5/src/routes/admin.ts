import Express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { type AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';
import AdminService from '../services/adminService.js';
import { isImageDataUrl, uploadImageDataUrl, uploadImageList } from '../services/uploadService.js';
import { getPaginationParams } from '../utils/pagination.js';
import { pickLocaleText, resolveRequestLocale } from '../utils/locale.js';
import config from '../config/index.js';

const router = Express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminHtmlCandidates = [
  path.resolve(__dirname, '../public/admin-panel.html'),
  path.resolve(process.cwd(), 'src/public/admin-panel.html'),
  path.resolve(process.cwd(), 'dist/public/admin-panel.html'),
  path.resolve(process.cwd(), 'api/_backend/public/admin-panel.html'),
  path.resolve(process.cwd(), 'api/_backend/dist/public/admin-panel.html'),
  path.resolve(process.cwd(), '../../后端V5/src/public/admin-panel.html'),
  path.resolve(process.cwd(), '../../后端V5/dist/public/admin-panel.html'),
];

const resolveAdminHtmlPath = () =>
  adminHtmlCandidates.find((candidate) => fs.existsSync(candidate)) || adminHtmlCandidates[0];

const ensureAdmin = (req: AuthRequest, res: Express.Response) => {
  const locale = resolveRequestLocale(req);
  const email = req.user?.email?.toLowerCase();

  if (!email) {
    res.status(401).json({
      success: false,
      error: pickLocaleText(locale, '尚未完成身份认证。', 'Authentication required.'),
      code: 401,
    });
    return false;
  }

  if (!config.admin.allowedEmails.includes(email)) {
    res.status(403).json({
      success: false,
      error: pickLocaleText(locale, '当前账号没有后台访问权限。', 'This account does not have admin access.'),
      code: 403,
    });
    return false;
  }

  return true;
};

const sendAdminError = (req: AuthRequest | Express.Request, res: Express.Response, error: unknown) => {
  const locale = resolveRequestLocale(req as Express.Request);
  console.error('Admin route error:', error);
  res.status(500).json({
    success: false,
    error: pickLocaleText(locale, '后台服务暂时不可用。', 'Admin service is temporarily unavailable.'),
    code: 500,
  });
};

const getActorEmail = (req: AuthRequest) => req.user?.email?.toLowerCase() || 'system';

const parseBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return Boolean(value);
};

const normalizeStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

router.get('/panel', (_req: Express.Request, res: Express.Response) => {
  res.sendFile(resolveAdminHtmlPath());
});

router.get('/runtime-config/public', async (req: Express.Request, res: Express.Response) => {
  try {
    const result = await AdminService.getPublicRuntimeConfig();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/overview', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.getOverview();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/options', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.getFormOptions();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/users', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const result = await AdminService.getUsers(page, limit, keyword);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/users/:userId/verification', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const isVerified = parseBoolean(req.body?.is_verified);
    const result = await AdminService.updateUserVerification(req.params.userId, isVerified, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/users/:userId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const updates = { ...(req.body as Record<string, unknown>) };
    const targetUserId = req.params.userId;

    if (typeof updates.avatar_url === 'string' && isImageDataUrl(updates.avatar_url)) {
      const uploaded = await uploadImageDataUrl({
        userId: targetUserId,
        dataUrl: updates.avatar_url,
        fileName: 'admin-user-avatar',
        folder: 'owners',
      });
      updates.avatar_url = uploaded.url;
    }

    if (Array.isArray(updates.photos)) {
      const nextPhotos = await uploadImageList(
        targetUserId,
        updates.photos.filter((image): image is string => typeof image === 'string'),
        'owners',
      );
      updates.photos = nextPhotos;
      if (!updates.avatar_url && nextPhotos[0]) {
        updates.avatar_url = nextPhotos[0];
      }
    }

    const result = await AdminService.updateUserProfile(targetUserId, updates, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/pets', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const result = await AdminService.getPets(page, limit, keyword);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/pets/:petId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const updates = { ...(req.body as Record<string, unknown>) };
    if (Array.isArray(updates.images)) {
      updates.images = await uploadImageList(
        req.params.petId,
        updates.images.filter((image): image is string => typeof image === 'string'),
        'pets',
      );
    }
    const result = await AdminService.updatePetRecord(req.params.petId, updates, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/market', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const result = await AdminService.getMarketProducts(page, limit, {
      keyword: typeof req.query.keyword === 'string' ? req.query.keyword : '',
      category: typeof req.query.category === 'string' ? req.query.category : '',
      status: typeof req.query.status === 'string' ? req.query.status : '',
    });
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/market', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const payload = { ...(req.body as Record<string, unknown>) };
    const sellerId = typeof payload.seller_id === 'string' ? payload.seller_id.trim() : req.user?.user_id || '';
    if (Array.isArray(payload.images)) {
      payload.images = await uploadImageList(
        sellerId || req.user?.user_id || 'admin',
        payload.images.filter((image): image is string => typeof image === 'string'),
        'market',
      );
    }
    const result = await AdminService.createMarketProduct({ ...payload, seller_id: sellerId }, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/market/:productId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const updates = { ...(req.body as Record<string, unknown>) };
    const sellerId = typeof updates.seller_id === 'string' ? updates.seller_id.trim() : req.user?.user_id || 'admin';
    if (Array.isArray(updates.images)) {
      updates.images = await uploadImageList(
        sellerId,
        updates.images.filter((image): image is string => typeof image === 'string'),
        'market',
      );
    }
    const result = await AdminService.updateMarketProduct(req.params.productId, updates, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.delete('/market/:productId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.deleteMarketProduct(req.params.productId, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/market-orders', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getMarketOrders(page, limit, keyword, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/market-orders', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveMarketOrder(req.body as Record<string, unknown>, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/market-orders/:orderId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveMarketOrder(req.body as Record<string, unknown>, getActorEmail(req), req.params.orderId);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/walk-orders', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getWalkOrders(page, limit, keyword, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/walk-orders', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveWalkOrder(req.body as Record<string, unknown>, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/walk-orders/:orderId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveWalkOrder(req.body as Record<string, unknown>, getActorEmail(req), req.params.orderId);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/care-bookings', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getCareBookings(page, limit, keyword, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/care-bookings', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveCareBooking(req.body as Record<string, unknown>, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/care-bookings/:bookingId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveCareBooking(req.body as Record<string, unknown>, getActorEmail(req), req.params.bookingId);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/breeding', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getBreedingRequests(page, limit, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/breeding/:requestId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.updateBreedingRequest(
      req.params.requestId,
      {
        status: typeof req.body?.status === 'string' ? req.body.status : undefined,
        notes: typeof req.body?.notes === 'string' ? req.body.notes : null,
      },
      getActorEmail(req),
    );
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/matches', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getMatches(page, limit, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/matches/:matchId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const status = typeof req.body?.status === 'string' ? req.body.status : '';
    const result = await AdminService.updateMatchStatus(req.params.matchId, status, getActorEmail(req));
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/pet-love', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const result = await AdminService.getPetLoveRecords(page, limit, keyword, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/pet-love', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.savePetLoveRecord(req.body as Record<string, unknown>, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/pet-love/:recordId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.savePetLoveRecord(req.body as Record<string, unknown>, getActorEmail(req), req.params.recordId);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/diaries', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const result = await AdminService.getDiaries(page, limit, keyword);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/diaries/:diaryId/review', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.reviewDiary(
      req.params.diaryId,
      {
        is_public: parseBoolean(req.body?.is_public),
        mood: req.body?.mood,
        tags: normalizeStringArray(req.body?.tags),
      },
      getActorEmail(req),
    );
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/messages', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const result = await AdminService.getMessages(page, limit, keyword);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/chat-sessions', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const type = req.query.type === 'pet' || req.query.type === 'owner' ? req.query.type : '';
    const result = await AdminService.getChatSessions(page, limit, type, keyword, status);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/chat-sessions', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveChatSession(req.body as Record<string, unknown>, getActorEmail(req));
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/chat-sessions/:sessionId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.saveChatSession(req.body as Record<string, unknown>, getActorEmail(req), req.params.sessionId);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/notifications', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const result = await AdminService.getNotifications(page, limit);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.post('/notifications', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.createNotifications(
      {
        message: typeof req.body?.message === 'string' ? req.body.message : '',
        type: typeof req.body?.type === 'string' ? req.body.type : 'system',
        user_ids: normalizeStringArray(req.body?.user_ids),
        target: req.body?.target === 'all' ? 'all' : 'single',
      },
      getActorEmail(req),
    );
    res.status(result.success ? 201 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.patch('/notifications/:notificationId', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.updateNotification(
      req.params.notificationId,
      {
        message: req.body?.message,
        type: req.body?.type,
        is_read: req.body?.is_read,
      },
      getActorEmail(req),
    );
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/login-activity', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const { page, limit } = getPaginationParams(req.query);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
    const result = await AdminService.getLoginActivity(page, limit, keyword);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/activity-logs', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const limit = Math.max(10, Math.min(200, Number(req.query.limit) || 80));
    const result = await AdminService.getActivityLogs(limit);
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.get('/runtime-config', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const result = await AdminService.getRuntimeConfig();
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

router.put('/runtime-config', authMiddleware, async (req: AuthRequest, res: Express.Response) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const realms = Array.isArray(req.body?.realms)
      ? req.body.realms.map((realm: Record<string, unknown>) => ({
          id: typeof realm.id === 'string' ? realm.id : '',
          name: typeof realm.name === 'string' ? realm.name : undefined,
          description: typeof realm.description === 'string' ? realm.description : undefined,
          onlineCount: realm.onlineCount,
          loadingPhrases: normalizeStringArray(realm.loadingPhrases),
          active: typeof realm.active === 'boolean' ? realm.active : realm.active === undefined ? undefined : parseBoolean(realm.active),
        }))
      : [];
    const result = await AdminService.updateRuntimeConfig({ realms }, getActorEmail(req));
    res.status(result.success ? 200 : result.code || 500).json(result);
  } catch (error) {
    sendAdminError(req, res, error);
  }
});

export default router;
