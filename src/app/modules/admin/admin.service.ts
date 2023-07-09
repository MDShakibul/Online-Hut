/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin, IAdminResponse, ILoginAdmin, ILoginAdminResponse } from "./admin.interface";
import { Admin } from "./admin.model";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const createAdmin = async (payload: IAdmin): Promise<IAdminResponse | null> => {
    const result = await Admin.create(payload);
    const { password, ...others } = result.toObject();
    return others;
  };

const loginAdmin = async (payload: ILoginAdmin): Promise<ILoginAdminResponse > => {
    const {phoneNumber, password} = payload;
    const admin = new Admin(); 
    const isAdminExist = await admin.isAdminExist(phoneNumber); 

    if(!isAdminExist){
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found')
    }

    if (await admin.isPasswordMatched(password, isAdminExist?.password) === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
    }

    // create accesstoken and refresh token
    const {_id, role} = isAdminExist;
    const accessToken = jwtHelpers.createToken({_id, role, phoneNumber}, config.jwt.secret as Secret, config.jwt.expires_in as string);
    const refreshToken = jwtHelpers.createToken({_id, role, phoneNumber}, config.jwt.refresh_secret as Secret, config.jwt.refresh_expires_in as string);


    return{
        accessToken,
        refreshToken
    }

    

  };

  export const AdminService = {
    createAdmin, loginAdmin
  };