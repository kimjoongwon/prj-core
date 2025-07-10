import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { PUBLIC_ROUTE_KEY } from '../decorator/public-route.decorator';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, context.getHandler());
    if (_.isEmpty(isPublic)) {
      return true;
    }

    return false;
  }
}
