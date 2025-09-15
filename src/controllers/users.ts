import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from '../errors/errors';
import { STATUS_OK, STATUS_CREATED } from '../constants/statusCodes';

const { JWT_SECRET = 'some-secret-key' } = process.env;

// GET /users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(STATUS_OK).send(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:userId
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

// POST /signup
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны.');
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await User.create({
      name, about, avatar, email, password: hash,
    });

    const createdObj = created.toObject();
    const { password: _password, ...userWithoutPassword } = createdObj;

    res.status(STATUS_CREATED).send(userWithoutPassword);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует.'));
      return;
    }
    next(err);
  }
};

// POST /signin
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password as string);
    if (!matched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Устанавливаем httpOnly cookie (и также возвращаем token в теле)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.status(STATUS_OK).send({ token });
  } catch (err) {
    next(err);
  }
};

// GET /users/me
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) throw new UnauthorizedError('Требуется авторизация');

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) throw new UnauthorizedError('Требуется авторизация');

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

// PATCH /users/me/avatar
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) throw new UnauthorizedError('Требуется авторизация');

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
