import { Role, Roles } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntity } from 'src/types';

export const CreateRoleSchema = z.object({
  name: z.enum([Roles.SUPER_ADMIN, Roles.USER]),
});

export class CreateRoleDto
  extends createZodDto(CreateRoleSchema)
  implements Omit<Role, CommonEntity> {}
