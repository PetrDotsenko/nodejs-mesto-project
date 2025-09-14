import { Request, Response, NextFunction } from 'express';
import { STATUS_INTERNAL } from '../constants/statusCodes';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? STATUS_INTERNAL;
  const message = statusCode === STATUS_INTERNAL ? 'На сервере произошла ошибка.' : err.message;
  res.status(statusCode).send({ message });
};
