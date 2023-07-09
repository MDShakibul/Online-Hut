import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';
import { findSeller } from './cow.utils';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { cowSearchableFields } from './cow.constant';

const createCow = async (payload: ICow): Promise<ICow | null> => {
  const isSeller = await findSeller(payload.seller.toString());

  if (!payload.label) {
    payload.label = 'for sale';
  }

  if (isSeller) {
    const result = (await Cow.create(payload)).populate('seller');
    return result;
  } else {
    throw new ApiError(400, 'Invalid seller');
  }
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calulatePagination(paginationOptions);

  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    andCondition.push({ price: { $gte: minPrice, $lte: maxPrice } });
  } else if (minPrice !== undefined) {
    andCondition.push({ price: { $gte: minPrice } });
  } else if (maxPrice !== undefined) {
    andCondition.push({ price: { $lte: maxPrice } });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Cow.countDocuments();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingelCow = async (id: string): Promise<ICow | null | undefined> => {
  const result = (await Cow.findById(id))?.populate('seller');
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null | undefined> => {
  const isSeller =
    payload?.seller && (await findSeller(payload.seller.toString()));

  if (isSeller || !payload.seller) {
    const result = await Cow.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    });
    return result;
  } else {
    throw new ApiError(400, 'Invalid seller');
  }
};
const delteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingelCow,
  updateCow,
  delteCow,
};
