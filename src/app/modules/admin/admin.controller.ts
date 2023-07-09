import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IAdminResponse, ILoginAdminResponse } from './admin.interface';
import { AdminService } from './admin.service';
import config from '../../../config';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);

  const { refreshToken, ...others } = result;

  //set refreshToken set in cookies

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
};
