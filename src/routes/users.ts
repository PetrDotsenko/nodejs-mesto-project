import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';
import { userIdParamValidation, profileUpdateValidation, avatarUpdateValidation } from '../validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate(userIdParamValidation), getUserById);
router.patch('/me', celebrate(profileUpdateValidation), updateProfile);
router.patch('/me/avatar', celebrate(avatarUpdateValidation), updateAvatar);

export default router;
