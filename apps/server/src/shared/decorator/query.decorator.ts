import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export const QueryWithTenant = createParamDecorator((value: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tenantId = request.cookies.tenantId;
  const query = request.query;

  if (tenantId) {
    query.tenantId = tenantId;
  }

  return plainToInstance(value, query);
});
