import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleType } from '../constants';
import { AuthUserInterceptor } from '../interceptors';
import { Roles } from './roles.decorator';
import { PublicRoute } from './public-route.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { PoliciesGuard } from '../guards/poilicies.guard';
import { JwtAuthGuard } from '../guards';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  const decorators = [
    PublicRoute(isPublicRoute),
    // ApiBearerAuth(),
    ApiCookieAuth('accessToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Roles(roles),
  ];

  if (!isPublicRoute) {
    decorators.push(UseGuards(JwtAuthGuard, PoliciesGuard, RolesGuard));
    decorators.push(UseInterceptors(AuthUserInterceptor));
  }

  return applyDecorators(...decorators);
}
