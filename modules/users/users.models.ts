import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose'

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUserModel {
  name: string;
  email: string;
  role: Roles;
  password: string;
}

const userModelSchema = new Schema<IUserModel>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

export const UserModel = model<IUserModel>('User', userModelSchema);

export interface AddUserBody {
  name: string
  email: string
  password1: string
  password2: string
}

export interface UserLogInData {
  email: string
  password: string
}
