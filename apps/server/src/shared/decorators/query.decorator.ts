import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Query = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tenantId = request.headers['tenant-id'];
  const query = request.query;

  if (tenantId) {
    query.tenantId = tenantId;
  }

  return query;
});
