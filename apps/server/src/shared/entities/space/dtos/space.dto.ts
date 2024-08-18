import { Space } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { StringField } from 'src/shared/decorators/field.decorators';
import { SpaceEntity } from '../space.entity';

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
