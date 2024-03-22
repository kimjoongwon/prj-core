import { z } from 'nestjs-zod/z';

import { spaceEntitySchema } from '../space.entity';
import { createZodDto } from 'nestjs-zod';
import { tenantDtoSchema } from '../../tenants/dtos/tenant.dto';
import { categoryDtoSchema } from '../../categories/dtos/category.dto';
import { groupDtoSchema } from '../../groups/dtos/group.dto';

export const spaceDtoSchmea = z
  .object({
    tenants: z.array(tenantDtoSchema).optional(),
    categories: z.array(categoryDtoSchema).optional(),
    groups: z.array(groupDtoSchema).optional(),
  })
  .merge(spaceEntitySchema);

export class SpaceDto extends createZodDto(spaceDtoSchmea) {}
