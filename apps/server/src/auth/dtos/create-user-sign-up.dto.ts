import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { profileSchema, userSchema } from '@shared/backend';

export const createSignUpPayloadSchema = z
  .object({
    user: userSchema,
    profile: profileSchema,
  })
  .required();

export class CreateSignUpPayloadDto extends createZodDto(
  createSignUpPayloadSchema,
) {}

export const jsonCreateUserSignUpPayloadSchema = zodToJsonSchema(
  createSignUpPayloadSchema,
);
