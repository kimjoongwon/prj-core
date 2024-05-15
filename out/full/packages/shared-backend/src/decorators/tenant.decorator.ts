import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['tenantId'];
    const user = request?.user;
    const tenant = user.tenants?.find(tenant => tenant?.id === tenantId);

    return tenant;
  },
);
