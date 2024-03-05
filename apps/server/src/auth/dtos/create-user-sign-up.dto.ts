import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CreateUserSchema } from 'src/users/dto/create-user.dto';
import { CreateProfileSchema } from 'src/profiles/dto/create-profile.dto';

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
