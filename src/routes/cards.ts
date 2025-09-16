import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { cardCreateValidation, cardIdParamValidation } from '../validators';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate(cardCreateValidation), createCard);
router.delete('/:cardId', celebrate(cardIdParamValidation), deleteCard);
router.put('/:cardId/likes', celebrate(cardIdParamValidation), likeCard);
router.delete('/:cardId/likes', celebrate(cardIdParamValidation), dislikeCard);

export default router;
