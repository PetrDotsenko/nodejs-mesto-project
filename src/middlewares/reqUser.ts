import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '68bf81cf35d71ed01158dc7d' };
  next();
};
