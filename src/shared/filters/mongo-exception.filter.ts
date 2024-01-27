import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MongoError, MongoBulkWriteError, MongoServerError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const code = exception.code;
    let title = 'Database Error';
    let message = 'Something went wrong with the database.';
    let status = 500;

    switch (code) {
      case 11000:
        title = 'Duplicated Value';
        status = 400;
        message = this.getDuplicateErrorMessage(exception);
        break;
      default:
        break;
    }

    const error = {
      statusCode: status,
      title: title,
      message,
    };

    return res.status(400).json(error);
  }

  private getDuplicateErrorMessage(
    exception: MongoServerError | MongoBulkWriteError,
  ): string {
    if (exception instanceof MongoBulkWriteError) {
      const writeError = exception.writeErrors[0];
      const error = writeError.err.errmsg;
      const splitError = error.split('"');
      if (splitError.length === 3) {
        return `The value ${splitError[1]} is already in use.`;
      }
    }
    if (exception instanceof MongoServerError) {
      const key = Object.keys(exception.keyPattern)[0];
      const value = exception.keyValue[key];
      return `The value ${value} is already in use.`;
    }
    return `One of the values is already in use.`;
  }
}
