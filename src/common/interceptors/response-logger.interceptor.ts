import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    if (!req) return next.handle();

    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        try {
          const res = http.getResponse();
          const status = res?.statusCode;
          const ms = Date.now() - start;
          let payload: string;
          try {
            payload = JSON.stringify(data);
          } catch (e) {
            payload = '[Unserializable response]';
          }
          this.logger.log(
            `${method} ${url} ${status} - ${ms}ms - response: ${payload}`,
          );
        } catch (err) {
          this.logger.log(
            `${method} ${url} - response logging failed: ${err?.message ?? err}`,
          );
        }
      }),
    );
  }
}
