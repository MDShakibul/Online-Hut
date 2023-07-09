import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserService } from './user.service';
import config from '../../../config';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './user.interface';
import { IResUser } from '../../../interfaces/resuser';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserService.createUser(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  console.log(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrived successfully',
    data: result,
  });
});
const getSingelUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingelUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrived successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserService.updateUser(req.params.id, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const delteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.delteUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await UserService.loginUser(loginData);

  const { refreshToken, ...others } = result;

  //set refreshToken set in cookies

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await UserService.refreshToken(refreshToken);

  //set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...userInfo } = req.user as IResUser;
  const result = await UserService.getProfileInfo(_id);

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's information retrieved successfully",
    data: result,
  });
});

const updateProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...userInfo } = req.user as IResUser;
  const result = await UserService.updateProfileInfo(_id, userData);

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User information updated successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingelUser,
  updateUser,
  delteUser,
  loginUser,
  refreshToken,
  getProfileInfo,
  updateProfileInfo,
};
