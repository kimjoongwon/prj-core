import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];
    if (!bearerToken) {
      return null;
    }
    const token = bearerToken.split(' ')[1];

    return token;
  },
);
