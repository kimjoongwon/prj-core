import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CreateUserSchema } from 'src/users/dto/create-user.dto';
import { CreateProfileSchema } from 'src/profiles/dto/create-profile.dto';
import { Roles } from '@coc/database';

export const CreateUserSignUpSchema = z
  .object({
    createUserDto: CreateUserSchema,
    createProfileDto: CreateProfileSchema,
    type: z.enum([Roles.USER, Roles.SUPER_ADMIN]),
  })
  .required();

export class CreateUserSignUpDto extends createZodDto(CreateUserSignUpSchema) {}

export const jsonCreateUserSignUpSchema = zodToJsonSchema(
  CreateUserSignUpSchema,
);
