import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { createZodDto } from 'nestjs-zod';
import { Tenant } from '@prisma/client';

export const tenantEntitySchema = z
  .object({
    userId: z.string(),
    spaceId: z.string(),
    roleId: z.string(),
  })
  .merge(commonSchema);

export class TenantEntity
  extends createZodDto(tenantEntitySchema)
  implements Tenant {}
