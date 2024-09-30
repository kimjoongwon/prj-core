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

    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, req) {
    console.log('여기 걸리네?');
    if (err || !req.user) {
      throw err || new UnauthorizedException();
    }
    return req.user;
  }
}
