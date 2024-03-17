import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CreateProfileSchema, CreateUserSchema } from '@coc/server';

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
