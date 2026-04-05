import { pickLocaleText, resolveRequestLocale } from '../utils/locale.js';
const configuredOrigin = process.env.FRONTEND_URL || '';
function isAllowedOrigin(origin) {
    if (!origin)
        return true;
    if (configuredOrigin && origin === configuredOrigin)
        return true;
    if (/^https?:\/\/localhost(?::\d+)?$/i.test(origin))
        return true;
    if (/^https:\/\/.+\.vercel\.app$/i.test(origin))
        return true;
    return false;
}
export const errorHandler = (err, req, res, next) => {
    void next;
    console.error('Error:', err);
    const locale = resolveRequestLocale(req);
    const statusCode = err.statusCode || 500;
    const fallbackMessage = pickLocaleText(locale, '服务器内部错误。', 'Internal server error.');
    const message = err.message || fallbackMessage;
    res.status(statusCode).json({
        success: false,
        error: message,
        code: statusCode,
        language: locale,
    });
};
export const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map