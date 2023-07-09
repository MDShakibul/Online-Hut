import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CowService } from './cow.service';
import pick from '../../../shared/pick';
import { ICow } from './cow.interface';
import { paginationFields } from '../../../constants/pagination';
import { cowFilterableFields } from './cow.constant';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingelCow = catchAsync(async (req: Request, res: Response) => {
  const result = await CowService.getSingelCow(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully',
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await CowService.updateCow(req.params.id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const delteCow = catchAsync(async (req: Request, res: Response) => {
  const result = await CowService.delteCow(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingelCow,
  updateCow,
  delteCow,
};
