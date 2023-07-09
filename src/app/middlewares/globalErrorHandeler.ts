import { ErrorRequestHandler, NextFunction } from 'express';
import config from '../../config';
import { IGenericErrorMessage } from '../../interfaces/error';
import handelValidationError from '../../errors/handelValidationError';
import handelZodError from '../../errors/handelZodError';
import handelCastError from '../../errors/handelCastError';
import ApiError from '../../errors/ApiError';
import { ZodError } from 'zod';

const globalErrorHandelar: ErrorRequestHandler = (
  error,
  req,
  res,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Somting went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handelValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handelZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error.name === 'CastError') {
    const simplifiedError = handelCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandelar;
