import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  Logger,
} from '@nestjs/common';
import { ContextProvider } from '../provider';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthUserInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const serviceId = request.cookies?.['serviceId'];
    const tenantId = request.cookies?.['tenantId'];

    this.logger.log(`AuthUserInterceptor - serviceId: ${serviceId}, tenantId: ${tenantId}`);
    this.logger.log(`Request user: ${JSON.stringify(request.user)}`);

    if (serviceId) {
      ContextProvider.setServiceId(serviceId);
    }

    if (tenantId) {
      ContextProvider.setTenantId(tenantId);
    }

    // JWT Strategy에서 user 객체를 직접 반환하므로 request.user가 직접 UserDto 타입
    if (request?.user?.id && request?.user?.tenants) {
      const user = <UserDto>request.user;
      this.logger.log(`Setting auth user: ${user.id}`);
      ContextProvider.setAuthUser(user);
      ContextProvider.setAuthUserId(user.id);
    }

    return next.handle();
  }
}
