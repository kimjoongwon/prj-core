import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { CommonEntity } from '../../entity';
import { User } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const userEntitySchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3, '최소 3글자 이상'),
    phone: z.string(),
    password: z.string(),
  })
  .merge(commonSchema);

export class UserEntity extends CommonEntity implements User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
