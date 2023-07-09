import { Schema, model } from 'mongoose';
import { IRetunUserExist, IUser, IUserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});


userSchema.methods.isUserExist = async function (
  mobile: string
): Promise<IRetunUserExist | null> {
  return await User.findOne({ phoneNumber: mobile }, { _id: 1, role: 1, password: 1, phoneNumber: 1 });
};

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
