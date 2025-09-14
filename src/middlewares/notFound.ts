import { Request, Response, NextFunction } from 'express';
import { STATUS_NOT_FOUND } from '../constants/statusCodes';

export default (req: Request, res: Response, next: NextFunction) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Ресурс не найден' });
};