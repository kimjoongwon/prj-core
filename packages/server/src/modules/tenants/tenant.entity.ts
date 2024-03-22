import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';
import { createZodDto } from 'nestjs-zod';
import { Tenant } from '@coc/database';

export const tenantEntitySchema = z
  .object({
    userId: z.string(),
    spaceId: z.string(),
    roleId: z.string(),
  })
  .merge(CommonEntitySchema);

export class TenantEntity
  extends createZodDto(tenantEntitySchema)
  implements Tenant {}
