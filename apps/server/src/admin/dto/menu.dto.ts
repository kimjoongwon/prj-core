import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { ADMIN_PAGES, ADMIN_PAGE_TITLES } from '../constants';

const textSchema = z.enum([
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_SERVICES],
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_USER_SERVICE],
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_USER_SERVICE_CATEGORY],
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_SETTING_SERVICE_SERVICES],
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_SETTING_SERVICE_SERVICE],
  ADMIN_PAGE_TITLES[ADMIN_PAGES.ADMIN_SETTING_SERVICE],
]);

export const menuSchema = z.object({
  text: textSchema,
  pathname: z.nativeEnum(ADMIN_PAGES),
  children: z
    .object({
      text: textSchema,
      pathname: z.nativeEnum(ADMIN_PAGES),
    })
    .array()
    .optional(),
});

export class MenuDto extends createZodDto(menuSchema) {}
