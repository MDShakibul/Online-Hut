import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { IResUser } from '../../../interfaces/resuser';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, role, ...userInfo } = req.user as IResUser;
  const result = await OrderService.getAllOrders(_id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});
const getSingleOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getSingleOrders(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrders,
};
