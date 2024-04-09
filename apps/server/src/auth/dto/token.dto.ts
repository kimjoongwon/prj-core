import { createZodDto } from 'nestjs-zod/dto';
import { lazy, z } from 'nestjs-zod/z';
import { userDtoSchema } from './user.dto';

const tokenDtoSchema = lazy(() =>
  z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: userDtoSchema,
  }),
);

export class TokenDto extends createZodDto(tokenDtoSchema) {}
