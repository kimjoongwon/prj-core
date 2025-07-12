import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums, UserDto } from '@shared/schema';
import _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const roles = this.reflector.get<$Enums.Roles[]>('roles', context.getHandler());

    // if (_.isEmpty(roles)) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const user = <UserDto>request.user;
    // const tenant = user.tenants.find((tenant) => tenant.active);

    // return roles.includes(tenant.role.name);
    return true;
  }
}
