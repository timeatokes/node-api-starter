// The Controller files will mostly be used for:
// - getting the Request, Body and Path parameters and passing them to the service
// - validating those parameters
// - Generating the Swagger Documentation

import { Request, Response, Tags, Route, Get, Post, Body, Path } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import {
  ControllerResponse,
  ControllerError,
  ExceptionSafe,
  controllerExceptionHandler,
  ErrorMessageCode,
} from '../../toolkit'
import { AddUserBody, IUserModel, UserLogInData, UserModel } from './users.models'
import UsersService from './users.service'

@Tags('Users')
@Route('users')
@ExceptionSafe(controllerExceptionHandler) // Wraps every method in a try-catch that returns a server error
export default class UsersController {
  @Get('/')
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Server Error')
  public static async getUsers(
    @Request() _request: ExpressRequest
  ): Promise<ControllerResponse<IUserModel[] | ControllerError>> {
    return await UsersService.getUsersList()
  }

  @Get('/{userId}')
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(404, 'Not Found')
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Server Error')
  public static async getUserById(
    @Request() _request: ExpressRequest,
    @Path() userId: string
  ): Promise<ControllerResponse<IUserModel | ControllerError>> {
    return await UsersService.getUserById(userId)
  }

  @Post('/')
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(400, 'Bad Request')
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Server Error')
  public static async addUser(
    @Request() _request: ExpressRequest,
    @Body() userDetails: AddUserBody
  ): Promise<ControllerResponse<IUserModel | ControllerError>> {
    return await UsersService.addUser(userDetails)
  }

  @Post('/login')
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(400, 'Bad Request')
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Server Error')
  public static async logInUser(
    @Request() _request: ExpressRequest,
    @Body() userDetails: UserLogInData
  ): Promise<ControllerResponse<string | ControllerError>> {
    return await UsersService.logInUser(userDetails)
  }
}
