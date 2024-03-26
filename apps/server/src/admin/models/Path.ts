import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ADMIN = 'admin';
export const ADMIN_DASHBOARD_SERVICE = 'admin/dashboard-service';
// export const ADMIN_SETTINGS = 'admin' + 'dashboard-service';
export const ADMIN_USER_SERVICE = 'admin/user-service';
export const ADMIN_USER_SERVICE_USERS = 'admin/user-service/users';
export const ADMIN_USER_SERVICE_USER = 'admin/user-service/users/:userId';
export const ADMIN_USER_SERVICE_USER_ROLES =
  'admin/user-service/users/:userId/roles';
export const ADMIN_USER_SERVICE_USER_ROLE =
  'admin/user-service/users/:userId/roles/:roleId';
export const ADMIN_USER_SERVICE_CATEGORIES =
  'admin/user-service/:serviceId/categories';
export const ADMIN_USER_SERVICE_CATEGORY =
  'admin/user-service/:serviceId/categories/:categoryId';
export const ADMIN_USER_SERVICE_GROUPS = 'admin/user-service/:serviceId/groups';
export const ADMIN_USER_SERVICE_GROUP =
  'admin/user-service/:serviceId/groups/:groupId';

export const createPath = (paths: string[]) => {
  return paths.join('/');
};

export const pathsSchema = z.enum([
  ADMIN_DASHBOARD_SERVICE,
  ADMIN_USER_SERVICE,
  ADMIN_USER_SERVICE_USERS,
  ADMIN_USER_SERVICE_USER,
  ADMIN_USER_SERVICE_USER_ROLES,
  ADMIN_USER_SERVICE_USER_ROLE,
  ADMIN_USER_SERVICE_CATEGORIES,
  ADMIN_USER_SERVICE_CATEGORY,
  ADMIN_USER_SERVICE_GROUPS,
  ADMIN_USER_SERVICE_GROUP,
]);

export type Paths = z.infer<typeof pathsSchema>;

export const menuSchema = z.object({
  text: z.string(),
  pathname: pathsSchema.optional(),
  children: z
    .object({
      text: z.string(),
      pathname: pathsSchema,
    })
    .array()
    .optional(),
});

export class MenuDto extends createZodDto(menuSchema) {}
