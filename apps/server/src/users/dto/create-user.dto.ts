import { User } from '@coc/database';
import { createZodDto } from 'nestjs-zod';
import { CommonEntity } from 'src/common/types/CommonEntity';
import zodToJsonSchema from 'zod-to-json-schema';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
  phone: z.string(),
});

export class CreateUserDto
  extends createZodDto(CreateUserSchema)
  implements Omit<User, CommonEntity> {}

export const jsonCreateUserDtoSschema = zodToJsonSchema(CreateUserSchema);
