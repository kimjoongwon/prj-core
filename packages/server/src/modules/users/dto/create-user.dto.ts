import { User } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { z } from 'nestjs-zod/z';
import { CommonEntity } from 'src/types';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(12),
  password: z.string().min(6).max(12),
  email: z.string().email(),
  phone: z.string().min(11).max(11),
});

export class CreateUserDto
  extends createZodDto(CreateUserSchema)
  implements Omit<User, CommonEntity> {}

export const jsonCreateUserDtoSschema =
  zodToJsonSchema(CreateUserSchema);
