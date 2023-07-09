import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
  IUserResponse,
} from './user.interface';
import { User } from './user.model';
import { findSellerExist } from './user.utils';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { Admin } from '../admin/admin.model';
import bcrypt from 'bcrypt';;

const createUser = async (payload: IUser): Promise<IUserResponse | null> => {
  const result = await User.create(payload);
  const { password, ...others } = result.toObject();
  return others;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find();
  return result;
};
const getSingelUser = async (userId: string): Promise<IUser | null> => {
  const result = await User.findById(userId);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {

  //hash update password
  if(payload.password){
    payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds))
  }
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const delteUser = async (userId: string): Promise<IUser | null> => {
  const isSellerExist = userId && (await findSellerExist(userId));
  if (isSellerExist) {
    const result = await User.findByIdAndDelete(userId);
    return result;
  } else {
    throw new ApiError(
      400,
      'This seller have cow. Please remove cow then delete this seller'
    );
  }
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const user = new User();
  const isUserExist = await user.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (await user.isPasswordMatched(password, isUserExist?.password) === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  // create accesstoken and refresh token
  const { _id, role, phoneNumber: userPhoneNumber } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { _id, role, userPhoneNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { _id, role, userPhoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  const user = new User();
  const admin = new Admin();
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  //checking deleted user's token
  const isUserExist = await user.isUserExist(verifiedToken.userPhoneNumber);
  const isAdminExist = await admin.isAdminExist(verifiedToken.phoneNumber);

  console.log(isUserExist, isAdminExist);

  //generate new token
  let newAccessToken = null;
  if (isUserExist) {
    newAccessToken = jwtHelpers.createToken(
      { id: isUserExist._id, role: isUserExist.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
  } else if (isAdminExist) {
    newAccessToken = jwtHelpers.createToken(
      { id: isAdminExist?._id, role: isAdminExist.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  return {
    accessToken: newAccessToken,
  };
};

const getProfileInfo = async (
  userId: string
): Promise<Partial<IUser> | null> => {
  const result = await User.findById(userId, {
    phoneNumber: 1,
    name: 1,
    address: 1,
  });

  //send data without password
  if (result) {
    const { name, phoneNumber, address } = result;
    const data = { name, phoneNumber, address };
    return data;
  }

  return null;
};

const updateProfileInfo = async (
  id: string,
  payload: Partial<IUser>
): Promise<Partial<IUser>  | null> => {
  if(payload.password){
    payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds))
  }
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    projection: { phoneNumber: 1, name: 1, address: 1 },
  });

  if (result) {
    const { name, phoneNumber, address } = result;
    const data = { name, phoneNumber, address };
    return data;
  }

  return null;;
};

export const UserService = {
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
