import {
  prorfileEntitySchema,
  tenantEntitySchema,
  userEntitySchema,
} from '@shared/backend';
import { createZodDto } from 'nestjs-zod';
import { lazy } from 'nestjs-zod/z';

export const userDtoSchema = lazy(() =>
  userEntitySchema.extend({
    tenants: tenantEntitySchema.array(),
    profiles: prorfileEntitySchema.array(),
  }),
);

export class UserDto extends createZodDto(userDtoSchema) {}
