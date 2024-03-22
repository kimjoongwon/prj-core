import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';
import { createZodDto } from 'nestjs-zod';

export const serviceEntitySchema = z
  .object({
    name: z.string(),
  })
  .merge(CommonEntitySchema);

export class ServiceEntity extends createZodDto(
  serviceEntitySchema,
) {}
