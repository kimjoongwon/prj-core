import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class TokenDto extends createZodDto(TokenSchema) {}
