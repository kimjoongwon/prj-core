import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { ContextProvider } from '../providers';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const serviceId = request.cookies['serviceId'];
    const tenantId = request.cookies['tenantId'];

    if (serviceId) {
      ContextProvider.setServiceId(serviceId);
    }

    if (tenantId) {
      ContextProvider.setTenantId(tenantId);
    }

    if (request?.user?.id && request?.user?.tenants) {
      const user = <UserDto>request.user;
      ContextProvider.setAuthUser(user);
      ContextProvider.setAuthUserId(user.id);
    }

    return next.handle();
  }
}
