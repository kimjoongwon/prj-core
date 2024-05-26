import { StringField } from '../decorators';
import { GroupEntity } from '../entities/group.entity';
import { AbstractDto } from './common/abstract.dto';

export class GroupDto extends AbstractDto {
  @StringField()
  id: string;

  @StringField()
  name: string;

  @StringField()
  spaceId: string;

  @StringField()
  serviceId: string;

  constructor(groupEntity: GroupEntity) {
    super(groupEntity);
    this.id = groupEntity.id;
    this.name = groupEntity.name;
    this.spaceId = groupEntity.spaceId;
    this.serviceId = groupEntity.serviceId;
    this.createdAt = groupEntity.createdAt;
  }
}
