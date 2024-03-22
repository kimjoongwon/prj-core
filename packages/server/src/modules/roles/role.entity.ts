import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';

export const roleEntitySchema = z
  .object({
    name: z.string(),
  })
  .merge(CommonEntitySchema)
  .required();

export class RoleEntity extends createZodDto(roleEntitySchema) {}
