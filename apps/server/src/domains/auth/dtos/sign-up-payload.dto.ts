import { Profile, User } from '@prisma/client';

class ProfileDto
  implements Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId'>
{
  nickname: string;
}

class UserDto implements Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  email: string;
  name: string;
  phone: string;
  password: string;
  spaceId: string;
}

export class SignUpPayloadDto {
  user: UserDto;
  profile: ProfileDto;
}
