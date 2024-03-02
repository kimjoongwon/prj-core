import { UserDtoSchema } from 'src/users/dto/user.dto';
import { ProfileEntitySchema } from '../profile.entity';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProfileDtoSchema = ProfileEntitySchema.merge(
  z.object({ user: UserDtoSchema }),
).omit({
  userId: true,
});

export class ProfileDto extends createZodDto(ProfileDtoSchema) {}
