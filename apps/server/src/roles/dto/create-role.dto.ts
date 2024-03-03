import { Role, Roles } from '@coc/database';
import { createZodDto } from 'nestjs-zod';
import { CommonEntity } from 'src/common/types/CommonEntity';
import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.enum([Roles.SUPER_ADMIN, Roles.USER]),
});

export class CreateRoleDto
  extends createZodDto(CreateRoleSchema)
  implements Omit<Role, CommonEntity> {}
