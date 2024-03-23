import { UserEntitySchema } from '../user.entity';
import { z } from 'nestjs-zod/z';
// import { profileDtoSchema } from '../../profiles/dto/profile.dto';
import { tenantDtoSchema } from '../../tenants/dtos/tenant.dto';
import { createZodDto } from 'nestjs-zod';

export const userDtoSchema = z
  .object({
    // profiles: z.array(profileDtoSchema),
    tenants: z.array(tenantDtoSchema),
  })
  .merge(UserEntitySchema);

export class UserDto extends createZodDto(userDtoSchema) {}
