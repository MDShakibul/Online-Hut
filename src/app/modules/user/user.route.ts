import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validationRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/my-profile', auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER), UserController.getProfileInfo);
router.patch('/my-profile', auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER), UserController.updateProfileInfo);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingelUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUpdateZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.delteUser);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
