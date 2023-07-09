import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);
router.post(
  '/login',
  validateRequest(AdminValidation.logAdminZodSchema),
  AdminController.loginAdmin
);

export const AdminAuthRoutes = router;
