import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleType } from '@shared/schema';
import { AuthUserInterceptor } from '../interceptor';
import { Roles } from './roles.decorator';
import { PublicRoute } from './public-route.decorator';
import { JwtAuthGuard } from '../guard';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  const decorators = [
    PublicRoute(isPublicRoute),
    ApiCookieAuth('accessToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Roles(roles),
  ];

  decorators.push(UseInterceptors(AuthUserInterceptor));

  if (!isPublicRoute) {
    decorators.push(UseGuards(JwtAuthGuard));
  }

  return applyDecorators(...decorators);
}
