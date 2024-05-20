import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { AbstractEntity } from '../../entity';
import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const userEntitySchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3, '최소 3글자 이상'),
    phone: z.string(),
    password: z.string(),
  })
  .merge(commonSchema);

export class UserEntity extends AbstractEntity implements User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}
