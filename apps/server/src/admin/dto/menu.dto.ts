import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { ADMIN_PAGES } from '../constants';

export const menuSchema = z.object({
  text: z.string(),
  pathname: z.nativeEnum(ADMIN_PAGES),
  children: z
    .object({
      text: z.string(),
      pathname: z.nativeEnum(ADMIN_PAGES),
    })
    .array()
    .optional(),
});

export class MenuDto extends createZodDto(menuSchema) {}
