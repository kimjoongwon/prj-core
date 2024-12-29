import { StringField, UUIDFieldOptional } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { GroupEntity } from '../group.entity';

export class GroupDto extends AbstractDto implements GroupEntity {
  @StringField()
  spaceId: string;

  @StringField()
  id: string;

  @StringField()
  name: string;

  @StringField()
  serviceId: string;
}
