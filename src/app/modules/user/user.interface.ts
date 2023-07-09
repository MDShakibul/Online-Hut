import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
  name: UserName;
  address: string;
  budget: number;
  income: number;
};

export type IUserResponse = {
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password?: string;
  name: UserName;
  address: string;
  budget: number;
  income: number;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  phoneNumber: string;
  password: string;
};

export type IRetunUserExist = {
  _id: string;
  role: 'admin';
  password: string;
  phoneNumber: string;
  
};

export type IRefreshTokenResponse = {
  accessToken: string;
};


export type IUserMethods = {
  isUserExist(mobile: string): Promise<IRetunUserExist| null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
