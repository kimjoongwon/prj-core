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
    const tenancyId = request.cookies['tenancyId'];

    // ContextProvider에 tenantId 설정

    // request의 body와 query에 tenantId 추가
    if (tenancyId) {
      if (request.body) {
        request.body.tenancyId = tenancyId;
      }
      if (request.query) {
        request.query.tenancyId = tenancyId;
      }
    }
    if (request?.user?.id && request?.user?.tenants) {
      const user = <UserDto>request.user;
      // const tenant = user?.tenants?.find((tenant) => tenant.active);
      ContextProvider.setAuthUser(user);
      // ContextProvider.setTenant(tenant);
    }

    return next.handle();
  }
}
