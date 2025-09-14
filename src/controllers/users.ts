import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { STATUS_OK, STATUS_CREATED } from '../constants/statusCodes';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(STATUS_OK).send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestError('Передан некорректный _id пользователя.');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.status(STATUS_CREATED).send(newUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(err);
    }
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new Error('User id not found in request');

    const { name, about } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updated) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    res.status(STATUS_OK).send(updated);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    } else {
      next(err);
    }
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new Error('User id not found in request');

    const { avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updated) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    res.status(STATUS_OK).send(updated);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
    } else {
      next(err);
    }
  }
};
