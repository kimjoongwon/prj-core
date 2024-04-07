import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../../schema/common.schema';

export const categoryEntitySchema = z
  .object({
    name: z.string().min(3, '최소 3글자 이상'),
    ancestorIds: z.array(z.string()),
    parentId: z.string().nullable(),
    spaceId: z.string(),
  })
  .merge(commonSchema);

export class CategoryEntity extends createZodDto(categoryEntitySchema) {}
