import { Space } from '@prisma/client';
import { SpaceEntity } from '../../models/space.entity';
import { AbstractDto } from '../common/abstract.dto';
import { StringField } from '../../../decorators/field.decorators';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  name: string;

  constructor(entity: SpaceEntity, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}
