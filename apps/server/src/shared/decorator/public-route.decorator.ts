import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'isPublic';
export const PublicRoute = (isPublic?: boolean) =>
  SetMetadata(PUBLIC_ROUTE_KEY, isPublic !== false);
