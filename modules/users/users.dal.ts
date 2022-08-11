// Data Access Layer for the Users
// This will contain all the database queries

import { UserModel, IUserModel } from "./users.models";
import { ExceptionSafe, dalExceptionHandler } from "../../toolkit";
import { ObjectId } from "mongodb";

@ExceptionSafe(dalExceptionHandler)
export default class UsersDal {
  public static async getUsersList(): Promise<IUserModel[] | null> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      return null;
    }
  }

  public static async getUserById(userId: string): Promise<IUserModel | null> {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      return user;
    } catch (error) {
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<IUserModel | null> {
    try {
      const user = await UserModel.findOne({email: email});
      return user;
    } catch (error) {
      return null;
    }
  }

  public static async addNewUser(userDetails: IUserModel): Promise<IUserModel | null> {
    try {
      const user = new UserModel({...userDetails});
      const newUser = await user.save();
      return newUser;
    } catch (error) {
      return null;
    }
  }

  public static async getUserPasswordByEmail(email: string): Promise<string | null> {
    try {
      const user = await UserModel.findOne({email: email});
      if (user) {
        return user.password;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async deleteUser(userId: string): Promise<IUserModel | null> {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(new ObjectId(userId));
      return deletedUser;
    } catch (error) {
      return null;
    }
  }
}
