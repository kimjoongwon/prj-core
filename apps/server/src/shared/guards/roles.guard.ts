import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

import { UserDto } from '../entities/users/dtos/user.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<$Enums.Roles[]>('roles', context.getHandler());

    if (_.isEmpty(roles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <UserDto>request.user;
    const tenant = user.tenants.find((tenant) => tenant.active);

    return roles.includes(tenant.role.name);
  }
}
