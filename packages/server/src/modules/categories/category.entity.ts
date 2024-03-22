import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';
import { createZodDto } from 'nestjs-zod';

export const categoryEntitySchema = z
  .object({
    name: z.string(),
    serviceId: z.string(),
    spaceId: z.string(),
    ancestorIds: z.array(z.string()),
    parentId: z.string(),
  })
  .merge(CommonEntitySchema);

export class CategoryEntity extends createZodDto(
  categoryEntitySchema,
) {}
