import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CreateProfileSchema } from 'src/modules/profiles/dto/create-profile.dto';
import { CreateUserSchema } from 'src/modules/users/dto/create-user.dto';

export const CreateUserSignUpSchema = z
  .object({
    createUserDto: CreateUserSchema,
    createProfileDto: CreateProfileSchema,
  })
  .required();

export class CreateUserSignUpDto extends createZodDto(CreateUserSignUpSchema) {}

export const jsonCreateUserSignUpSchema = zodToJsonSchema(
  CreateUserSignUpSchema,
);
