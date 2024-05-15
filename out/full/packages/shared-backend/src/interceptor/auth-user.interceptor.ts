import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';

import { ContextProvider } from '../providers';
import { User } from '@prisma/client';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();

    const user = <User>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
