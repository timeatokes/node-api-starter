import { body } from 'express-validator'
import { validationReporter, CommonErrorCodes } from '../../toolkit/'

export const validateNewUserRequest = [
  body('name')
    .isLength({ min: 3 })
    .withMessage(CommonErrorCodes.TOO_SHORT)
    .isLength({ max: 100 })
    .withMessage(CommonErrorCodes.TOO_LONG)
    .trim(),
  validationReporter,
]
