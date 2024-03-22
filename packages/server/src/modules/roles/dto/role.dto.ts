import { z } from 'nestjs-zod/z';
import { roleEntitySchema } from '../role.entity';
import { createZodDto } from 'nestjs-zod';
import { tenantDtoSchema } from '../../tenants/dtos/tenant.dto';

export const RoleDtoSchema = z
  .object({
    name: z.string(),
    tenants: z.array(tenantDtoSchema),
  })
  .merge(roleEntitySchema);

export class RoleDto extends createZodDto(RoleDtoSchema) {}
