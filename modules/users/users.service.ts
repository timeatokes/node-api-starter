// This file will contain all the logic of the routes

import UsersDal from './users.dal'
import { AddUserBody, IUserModel, Roles, UserLogInData, UserModel } from './users.models'
import { ControllerError, ControllerResponse, ResponseFactory } from '../../toolkit'
import bcrypt from 'bcrypt'

export default class UsersService {
  public static async getUsersList(): Promise<ControllerResponse<IUserModel[] | ControllerError>> {
    const users = await UsersDal.getUsersList()
    
    if (!users) {
      return ResponseFactory.createNotFoundError()
    }

    return ResponseFactory.createResponse(users)
  }

  public static async getUserById(userId: string): Promise<ControllerResponse<IUserModel | ControllerError>> {
    const user = await UsersDal.getUserById(userId)
    
    if (!user) {
      return ResponseFactory.createNotFoundError()
    }

    return ResponseFactory.createResponse(user)
  }

  public static async addUser(userDetails: AddUserBody): Promise<ControllerResponse<IUserModel | ControllerError>> {
    const { name, email, password1, password2 } = userDetails

    const existingUser = await UsersDal.getUserByEmail(email)
    if (existingUser) {
      return ResponseFactory.createBadRequestError('A user with this already exists')
    }

    if (password1 !== password2) {
      return ResponseFactory.createBadRequestError('The two passwords don\'t match')
    }

    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password1, salt);

      const newUser = await UsersDal.addNewUser({ name, email, password: hashedPassword, role: Roles.USER })

      if (newUser) {
        return ResponseFactory.createResponse(newUser)
      }

      return ResponseFactory.createInternalServerError()
    } catch (error) {
      return ResponseFactory.createInternalServerError()
    }
  }

  public static async logInUser(userData: UserLogInData): Promise<ControllerResponse<string | ControllerError>> {
    const userPassword = await UsersDal.getUserPasswordByEmail(userData.email)
    
    if (!userPassword) {
      return ResponseFactory.createResponse('Unsuccesful login')
    }

    if (await bcrypt.compare(userData.password, userPassword)) {
      return ResponseFactory.createResponse('Succesful login')
    }

    return ResponseFactory.createResponse('Unsuccesful login')
  }
}
