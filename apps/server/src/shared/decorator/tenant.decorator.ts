// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { UserDto } from '../entities';

// export const Tenant = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
//   const request = ctx.switchToHttp().getRequest();
//   const tenantId = request.headers['tenantId'];
//   const user = request?.user as UserDto;
//   const tenant = user.tenants?.find((tenant) => tenant?.id === tenantId);

//   return tenant;
// });
