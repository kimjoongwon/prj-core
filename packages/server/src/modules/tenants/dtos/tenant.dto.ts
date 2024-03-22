import { z } from 'nestjs-zod/z';
import { RoleDtoSchema } from '../../roles/dto/role.dto';
import { spaceDtoSchmea } from '../../spaces/dto/space.dto';
import { userDtoSchema } from '../../users';
import { createZodDto } from 'nestjs-zod';

export const tenantDtoSchema = z.object({
  role: RoleDtoSchema.optional(),
  space: spaceDtoSchmea.optional(),
  user: userDtoSchema.optional(),
});

export class TenantDto extends createZodDto(tenantDtoSchema) {}
