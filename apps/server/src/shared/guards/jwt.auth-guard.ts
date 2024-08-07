import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TenantDto, TenantsService } from '@shared';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tenantsService: TenantsService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, req) {
    if (err || !req.tenant) {
      throw err || new UnauthorizedException();
    }
    return req.tenant;
  }

  async getRequest(context: ExecutionContext): Promise<Request> {
    const request = context.switchToHttp().getRequest() as Request & { tenant: TenantDto };
    const tenantId = request.headers['tenantId'];

    if (typeof tenantId === 'string') {
      const tenant = await this.tenantsService.getUniqueById(tenantId);
      request.tenant = tenant;
    }

    return request;
  }
}
