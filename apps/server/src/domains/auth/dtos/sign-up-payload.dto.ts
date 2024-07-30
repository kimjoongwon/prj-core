import { Profile, User } from '@prisma/client';

class ProfileDto implements Profile {
  id: string;
  nickname: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

class UserDto implements User {
  id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  spaceId: string;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

export class SignUpPayloadDto {
  user: UserDto;
  profile: ProfileDto;
}
