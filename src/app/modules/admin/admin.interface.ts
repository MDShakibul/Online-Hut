import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: AdminName;
  address: string;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type IAdminResponse = {
  phoneNumber: string;
  role: 'admin';
  password?: string;
  name: AdminName;
  address: string;
};
export type IRetunAdminExist = {
  _id: string;
  role: 'admin';
  password: string;
  phoneNumber: string;
};
export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IAdminMethods = {
  isAdminExist(mobile: string): Promise<IRetunAdminExist| null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;
