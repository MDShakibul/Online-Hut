import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validationRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

router.post(
  '/login',
  validateRequest(UserValidation.logUserZodSchema),
  UserController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenZodSchema),
  UserController.refreshToken
);

export const UserAuthRoutes = router;
