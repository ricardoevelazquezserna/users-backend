import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception?.getStatus() || 500;
    const description = exception?.['options']?.description || '';
    const response = exception?.getResponse();
    let details = '';

    if (Array.isArray(response['message']) && response['message'].length > 0) {
      details = response['message'][0];
    } else if (typeof response['message'] === 'string') {
      details = response['message'];
    } else {
      details = description;
    }

    const error = {
      statusCode: status,
      title: exception.name || response['error'],
      message: details,
    };

    const log = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      name: exception.name || response['error'],
      details,
      path: req.url,
      method: req.method,
      body: req.body,
      user: req.headers?.user || '',
    };

    console.error(JSON.stringify(log));

    return res.status(status).json(error);
  }
}
