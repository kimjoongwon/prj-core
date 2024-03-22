import { ProfileEntitySchema } from '../profile.entity';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { userDtoSchema } from '../../users/dto/user.dto';

export const profileDtoSchema = ProfileEntitySchema.merge(
  z.object({ user: userDtoSchema }),
).omit({
  userId: true,
});

export class ProfileDto extends createZodDto(profileDtoSchema) {}
