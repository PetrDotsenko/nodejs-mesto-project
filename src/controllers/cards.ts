import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/errors';
import { STATUS_OK, STATUS_CREATED } from '../constants/statusCodes';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate('owner').populate('likes');
    res.status(STATUS_OK).send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?._id;
    if (!ownerId) throw new Error('User id not found in request');

    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(STATUS_CREATED).send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError('Передан некорректный _id карточки.');
    }

    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена.');
    }

    const ownerId = req.user?._id;
    if (!ownerId) throw new Error('User id not found in request');

    if (card.owner.toString() !== ownerId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку.');
    }

    await Card.findByIdAndDelete(cardId);
    res.status(STATUS_OK).send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError('Передан некорректный _id карточки.');
    }

    const updated = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ).populate('likes');

    if (!updated) {
      throw new NotFoundError('Карточка не найдена.');
    }

    res.status(STATUS_OK).send(updated);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError('Передан некорректный _id карточки.');
    }

    const updated = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    ).populate('likes');

    if (!updated) {
      throw new NotFoundError('Карточка не найдена.');
    }

    res.status(STATUS_OK).send(updated);
  } catch (err) {
    next(err);
  }
};
