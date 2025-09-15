import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errors';

const { JWT_SECRET = 'some-secret-key' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.jwt as string | undefined;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      token = authHeader.replace('Bearer ', '');
    }

    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Неправильный токен');
    }

    req.user = payload as any;
    next();
  } catch (err) {
    next(err);
  }
};
