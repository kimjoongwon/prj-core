import { UserEntitySchema } from '../user.entity';
import { z } from 'nestjs-zod/z';
import { profileDtoSchema } from '../../profiles/dto/profile.dto';

export const userDtoSchema = z
  .object({
    profiles: z.array(profileDtoSchema),
    tenants: z.array(z.string()),
  })
  .merge(UserEntitySchema);

export type UserDto = z.infer<typeof userDtoSchema>;
