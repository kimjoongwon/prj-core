import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class TokenDto extends createZodDto(TokenSchema) {}
