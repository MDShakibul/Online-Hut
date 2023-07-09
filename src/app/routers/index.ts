import express from 'express';
import { UserAuthRoutes } from '../modules/user/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/order/order.route';
import { AdminAuthRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserAuthRoutes,
  },
  {
    path: '/admins',
    route: AdminAuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

// router.use('/auth', UserAuthRoutes);

export default router;
