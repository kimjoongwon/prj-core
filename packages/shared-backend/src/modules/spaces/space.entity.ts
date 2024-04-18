import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { CommonEntity } from '../../entity';
import { Exclude, Expose } from 'class-transformer';
import { Space } from '@prisma/client';

export const spaceEntitySchema = z
  .object({
    name: z.string().min(3).max(255),
  })
  .merge(commonSchema);

export class SpaceEntity extends CommonEntity implements Space {
  @Exclude() _name: string;

  constructor(space: SpaceEntity) {
    super();
    Object.assign(this, space);
  }

  @Expose()
  get name(): string {
    return this._name;
  }
}
