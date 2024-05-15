import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const TokenPayloadSchema = z.object({
  expiresIn: z.number(),
  accessToken: z.string(),
});

export class TokenPayloadDto extends createZodDto(TokenPayloadSchema) {}
