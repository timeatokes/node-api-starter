import { ErrorMessageCode } from './error-message-codes'

export enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
  UNAUTHORIZED = 'USER-UNAUTHORIZED',
  BAD_REQUEST = 'USER-BAD-REQUEST',
  NOT_FOUND = 'NOT-FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL-SERVER-ERROR',
}

export interface ComplexErrorMessage {
  [key: string]: string
}

export interface ControllerError {
  message: string | ComplexErrorMessage
  code: ErrorCode
}

export interface ControllerBadRequestError extends ControllerError {
  formFieldErrors?: {
    [key: string]: string[]
  }
}

export interface ControllerResponse<T> {
  statusCode: StatusCode
  body: T
}

export class ResponseFactory {
  public static createResponse<T>(responseBody: T): ControllerResponse<T> {
    return {
      statusCode: StatusCode.OK,
      body: responseBody,
    }
  }

  private static createError(
    statusCode: Exclude<StatusCode, StatusCode.OK>,
    message?: string | ComplexErrorMessage,
    errorCode?: ErrorCode,
    customProperties?: any
  ): ControllerResponse<ControllerError | ControllerBadRequestError> {
    const errorDefaults: Record<Exclude<StatusCode, StatusCode.OK>, ControllerError | ControllerBadRequestError> = {
      [StatusCode.NOT_FOUND]: {
        message: ErrorMessageCode.NOT_FOUND,
        code: ErrorCode.NOT_FOUND,
      },
      [StatusCode.BAD_REQUEST]: {
        message: ErrorMessageCode.BAD_REQUEST,
        code: ErrorCode.BAD_REQUEST,
      },
      [StatusCode.UNAUTHORIZED]: {
        message: ErrorMessageCode.UNAUTHORIZED,
        code: ErrorCode.UNAUTHORIZED,
      },
      [StatusCode.INTERNAL_SERVER_ERROR]: {
        message: ErrorMessageCode.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
      },
    }

    const errorResponse = {
      statusCode: statusCode,
      body: {
        message: message ?? errorDefaults[statusCode].message,
        code: errorCode ?? errorDefaults[statusCode].code,
      },
    }

    if (customProperties?.value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      errorResponse.body[customProperties.key] = customProperties.value
    }

    return errorResponse
  }

  public static createBadRequestError(
    message?: string,
    formFieldErrors?: { [key: string]: string[] },
    errorCode?: ErrorCode
  ): ControllerResponse<ControllerBadRequestError> {
    const customProperties = {
      key: 'formFieldErrors',
      value: formFieldErrors,
    }
    return this.createError(StatusCode.BAD_REQUEST, message, errorCode, customProperties)
  }

  public static createUnauthorizedError(
    message?: string | { loginUrl: string },
    errorCode?: ErrorCode
  ): ControllerResponse<ControllerError> {
    return this.createError(StatusCode.UNAUTHORIZED, message, errorCode)
  }

  public static createInternalServerError(
    message?: string,
    errorCode?: ErrorCode
  ): ControllerResponse<ControllerError> {
    return this.createError(StatusCode.INTERNAL_SERVER_ERROR, message, errorCode)
  }

  public static createNotFoundError(message?: string, errorCode?: ErrorCode): ControllerResponse<ControllerError> {
    return this.createError(StatusCode.NOT_FOUND, message, errorCode)
  }
}
