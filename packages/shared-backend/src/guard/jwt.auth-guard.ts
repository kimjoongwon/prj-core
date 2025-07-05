import { ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from '../decorator/public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();

    this.logger.log(`JwtAuthGuard canActivate - isPublic: ${isPublic}`);
    this.logger.log(`Request path: ${request.path}`);
    this.logger.log(`Request method: ${request.method}`);

    if (isPublic) {
      this.logger.log('Route is public, allowing access');
      return true;
    }

    this.logger.log('Route is protected, checking JWT');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    this.logger.log(
      `JWT handleRequest - err: ${!!err}, user: ${!!user}, info: ${JSON.stringify(info)}`,
    );

    if (err) {
      this.logger.error(`JWT authentication error: ${err.message}`, err.stack);
      throw err;
    }

    if (!user) {
      this.logger.error(`JWT authentication failed - no user found. Info: ${JSON.stringify(info)}`);
      throw new UnauthorizedException('Authentication failed');
    }

    this.logger.log(`JWT authentication successful for user: ${user.id}`);
    return user;
  }
}
