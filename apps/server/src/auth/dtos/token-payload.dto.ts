import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TokenPayloadSchema = z.object({
  expiresIn: z.number(),
  accessToken: z.string(),
});

export class TokenPayloadDto extends createZodDto(TokenPayloadSchema) {}
