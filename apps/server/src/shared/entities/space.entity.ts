import { z } from 'nestjs-zod/z';
import { commonSchema } from '../schema/common.schema';
import { AbstractEntity } from '.';
import { Space } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const spaceEntitySchema = z
  .object({
    name: z.string().min(3).max(255),
  })
  .merge(commonSchema);

export class SpaceEntity extends AbstractEntity implements Space {
  @ApiProperty()
  name: string;
}
