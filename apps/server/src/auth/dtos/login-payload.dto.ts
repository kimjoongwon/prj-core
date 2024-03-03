import { createZodDto } from 'nestjs-zod';
import { UserDtoSchema } from 'src/users/dto/user.dto';
import { z } from 'zod';
import { TokenPayloadSchema } from './token-payload.dto';

export const LoginPayloadSchema = z.object({
  user: UserDtoSchema,
  token: TokenPayloadSchema,
});

export class LoginPayloadDto extends createZodDto(LoginPayloadSchema) {}
