import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { createZodDto } from 'nestjs-zod';

export const spaceEntitySchema = z
  .object({
    name: z.string().min(3).max(255),
  })
  .merge(commonSchema);

export class SpaceEntity extends createZodDto(spaceEntitySchema) {}
