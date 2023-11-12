import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const ctx = GqlExecutionContext.create(context);

    this.logger.debug(`Before...`);

    // this.logger.debug(
    //   'body:',
    //   JSON.stringify(ctx.getContext<{ req: Request }>().req.body),
    // );

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => this.logger.debug(`After... ${Date.now() - now}ms`)));
  }
}
