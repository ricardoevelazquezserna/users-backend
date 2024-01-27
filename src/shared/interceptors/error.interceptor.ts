import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log('ErrorInterceptor');
        console.log(error);
        const translatedTitle = 'Error title';
        const translatedMessage = 'Error message';
        error.name = translatedTitle;
        error.message = translatedMessage;
        throw error;
      }),
    );
  }
}
