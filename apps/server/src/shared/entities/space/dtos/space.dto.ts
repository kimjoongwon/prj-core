import { Space } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { SpaceEntity } from '../space.entity';
import { StringField } from '../../../decorators/field.decorators';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  name: string;

  constructor(entity: SpaceDto, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.removedAt = entity.removedAt;
  }
}
