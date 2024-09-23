import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ClassField, StringField } from '../../../decorators/field.decorators';
import { Space } from '../space.entity';
import { Tenancy } from '../../tenancies';
import { GroupDto } from '../../groups/dtos/group.dto';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  name: string;

  @ClassField(() => Tenancy, { isArray: true, nullable: true })
  tenancies?: Tenancy[];

  @ClassField(() => GroupDto, { nullable: true })
  groups?: GroupDto[];

  constructor(entity: Space, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.removedAt = entity.removedAt;
  }
}
