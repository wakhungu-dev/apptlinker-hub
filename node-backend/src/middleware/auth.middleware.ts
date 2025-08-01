import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express';

interface JwtPayload {
  userId: string;
  role: string;
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(401).json({ error: 'No authentication token provided' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;
    
    (req as AuthRequest).user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = (req as AuthRequest).user.role;
      
      if (!roles.includes(userRole)) {
        res.status(403).json({ error: 'Access denied: insufficient permissions' });
        return;
      }
      
      next();
    } catch (error) {
      res.status(403).json({ error: 'Access denied' });
    }
  };
};
