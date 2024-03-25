import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const ADMIN_USER_SERVICE_USERS = 'admin/user-service/users';
const ADMIN_USER_SERVICE_USER = 'admin/user-service/users/:id';
const ADMIN_DASH_BOARD = 'admin/dashboard';
const ADMIN_SERVICE = 'admin/service';
const ADMIN_SETTINGS = 'admin/service/settings';

export const createPath = (paths: string[]) => {
  return paths.join('/');
};

export const pathsSchema = z.enum([
  ADMIN_USER_SERVICE_USERS,
  ADMIN_USER_SERVICE_USER,
  ADMIN_DASH_BOARD,
  ADMIN_SERVICE,
  ADMIN_SETTINGS,
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
    .optional()
    .array()
    .default([]),
});

export class MenuDto extends createZodDto(menuSchema) {}
