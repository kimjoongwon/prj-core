import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
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
