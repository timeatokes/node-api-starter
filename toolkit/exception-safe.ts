import { ResponseFactory } from './response-factory'

export const ExceptionSafe = (errorHandler: (error: unknown) => unknown) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    for (const propertyName of Object.getOwnPropertyNames(target)) {
      const descriptor = Object.getOwnPropertyDescriptor(target, propertyName)
      const isMethod = descriptor?.value instanceof Function
      if (!isMethod) continue

      Object.defineProperty(target, propertyName, _generateDescriptor(descriptor, errorHandler))
    }
  }
}

function _generateDescriptor(
  descriptor: PropertyDescriptor,
  errorHandler: (error: unknown) => unknown
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: unknown[]) {
    try {
      return await originalMethod.apply(this, args)
    } catch (error) {
      return errorHandler(error)
    }
  }

  return descriptor
}

export const controllerExceptionHandler = (error: unknown) => {
  console.error(error)
  return ResponseFactory.createInternalServerError((error as Error).toString())
}

export const dalExceptionHandler = (error: unknown) => {
  console.error(error)
  return null
}
