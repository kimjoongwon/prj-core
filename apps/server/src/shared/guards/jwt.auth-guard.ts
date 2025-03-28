import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, req) {
    if (err || !req.user) {
      throw (
        err ||
        new UnauthorizedException({
          name: '김중원',
          message: '인증되지 않은 사용자입니다.',
        })
      );
    }
    return req.user;
  }
}
