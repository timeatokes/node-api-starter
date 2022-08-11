import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ResponseFactory } from './response-factory'

export function validationReporter(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const formFieldErrors: { [key: string]: string[] } = {}
    result.array().map(error => {
      if (formFieldErrors[error.param]) {
        formFieldErrors[error.param].push(error.msg)
      } else {
        formFieldErrors[error.param] = [error.msg]
      }
    })
    const response = ResponseFactory.createBadRequestError('There has been an error with your request', formFieldErrors)
    return res.status(response.statusCode).send(response.body)
  }

  next()
}

export enum CommonErrorCodes {
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  REQUIRED = 'REQUIRED',
  NOT_FOUND = 'NOT_FOUND',
  NOT_EXIST = 'NOT_EXIST',
  NOT_VALID_FORMAT = 'NOT_VALID_FORMAT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_EMPTY = 'NOT_EMPTY',
  NOT_VALID_VALUE = 'NOT_VALID_VALUE',
}
