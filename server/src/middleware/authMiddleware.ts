import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface AdminToken {
  adminId: number;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminToken;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;

  if (!token) {

    res.status(401).json({
      message: 'Access denied. Please login.'
    });

    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {

    res.status(500).json({
      message: 'Authentication configuration error.'
    });

    return;
  }

  try {

    const decoded = jwt.verify(token, secret) as AdminToken;

    (req as AuthenticatedRequest).admin = decoded;

    next();

  } catch {

    res.status(401).json({
      message: 'Invalid or expired token.'
    });

  }
};