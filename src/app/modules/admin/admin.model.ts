import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin, IAdminMethods, IRetunAdminExist } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const AdminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true, select: false },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

AdminSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

AdminSchema.methods.isAdminExist = async function (
  mobile: string
): Promise<IRetunAdminExist | null> {
  return await Admin.findOne({ phoneNumber: mobile }, { _id: 1, role: 1, password: 1, phoneNumber: 1 });
};

AdminSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
