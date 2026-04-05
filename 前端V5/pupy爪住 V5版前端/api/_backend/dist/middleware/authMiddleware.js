import AuthService from '../services/authService.js';
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Authentication token is missing.',
                code: 401,
            });
        }
        const decoded = AuthService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: 'Authentication token is invalid.',
                code: 401,
            });
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            error: 'Authentication failed.',
            code: 401,
        });
    }
};
export default authMiddleware;
//# sourceMappingURL=authMiddleware.js.map