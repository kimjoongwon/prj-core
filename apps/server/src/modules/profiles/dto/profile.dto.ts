import { ProfileEntitySchema } from '../profile.entity';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { UserDtoSchema } from 'src/modules/users/dto/user.dto';

export const ProfileDtoSchema = ProfileEntitySchema.merge(
  z.object({ user: UserDtoSchema }),
).omit({
  userId: true,
});

export class ProfileDto extends createZodDto(ProfileDtoSchema) {}
