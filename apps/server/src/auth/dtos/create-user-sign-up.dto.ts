import { z } from 'nestjs-zod/z';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Profile, User } from '@prisma/client';

export const createSignUpPayloadSchema = z
  .object({
    user: z.object({}),
    profile: z.object({}),
  })
  .required();

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
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

export class CreateSignUpPayloadDto {
  user: UserDto;
  profile: ProfileDto;
}

export const jsonCreateUserSignUpPayloadSchema = zodToJsonSchema(
  createSignUpPayloadSchema,
);
