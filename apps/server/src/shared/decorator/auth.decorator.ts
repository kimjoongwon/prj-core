import { UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { RoleType } from '@shared/schema';
import { JwtAuthGuard } from '../guard';
import { AuthUserInterceptor } from '../interceptor';
import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>
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
