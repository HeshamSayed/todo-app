import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};