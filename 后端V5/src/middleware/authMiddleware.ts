import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService.js';
import { JWTPayload } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未提供认证令牌',
        code: 401,
      });
    }

    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: '无效的令牌',
        code: 401,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: '认证失败',
      code: 401,
    });
  }
};

export default authMiddleware;
