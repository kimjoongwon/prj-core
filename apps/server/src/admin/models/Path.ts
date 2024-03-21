import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const ADMIN_USER_SERVICE_USERS = 'admin/userService/users';
const ADMIN_USER_SERVICE_USER = 'admin/userService/users/:id';

export const createPath = (paths: string[]) => {
  return paths.join('/');
};

export const pathsSchema = z.enum([
  ADMIN_USER_SERVICE_USERS,
  ADMIN_USER_SERVICE_USER,
]);

export type Paths = z.infer<typeof pathsSchema>;

export const menuSchema = z.object({
  text: z.string(),
  icon: z.string(),
  pathname: pathsSchema,
  children: z
    .object({
      text: z.string(),
      icon: z.string(),
      pathname: pathsSchema,
    })
    .optional()
    .array()
    .default([]),
});

export class MenuDto extends createZodDto(menuSchema) {}
