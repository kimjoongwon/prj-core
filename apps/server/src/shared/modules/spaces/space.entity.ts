import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { CommonEntity } from '../../entity';
import { Space } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const spaceEntitySchema = z
  .object({
    name: z.string().min(3).max(255),
  })
  .merge(commonSchema);

export class SpaceEntity extends CommonEntity implements Space {
  @ApiProperty()
  name: string;

  constructor(space: SpaceEntity) {
    super();
    Object.assign(this, space);
  }
}
