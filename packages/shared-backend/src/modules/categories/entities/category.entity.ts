import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { Category } from '@prisma/client';
import { commonSchema } from '../../../schema/common.schema';

export const categoryEntitySchema: z.ZodType<Category> = z
  .object({
    name: z.string(),
    ancestorIds: z.array(z.string()),
    parentId: z.string().nullable(),
    serviceId: z.string(),
    spaceId: z.string(),
  })
  .merge(commonSchema);

export class CategoryEntity extends createZodDto(categoryEntitySchema) {}
