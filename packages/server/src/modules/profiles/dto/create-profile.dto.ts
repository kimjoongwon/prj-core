import { Profile } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntity } from 'src/types';

export const defaultProfileObject: Profile = {
  id: '',
  nickname: '',
  userId: '',
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
};

export const CreateProfileSchema = z
  .object({
    nickname: z.string().default(defaultProfileObject.nickname),
    userId: z.string(),
  })
  .required();

export class CreateProfileDto
  extends createZodDto(CreateProfileSchema)
  implements Omit<Profile, CommonEntity> {}
