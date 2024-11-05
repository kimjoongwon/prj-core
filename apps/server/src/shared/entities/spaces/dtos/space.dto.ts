import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ClassField, StringField, UUIDField } from '../../../decorators/field.decorators';
import { Space } from '../space.entity';
import { GroupDto } from '../../groups/dtos/group.dto';

export class SpaceDto extends AbstractDto implements Space {
  @UUIDField({ nullable: true })
  classificationId: string | null;

  @UUIDField({ each: true, default: [] })
  assignmentIds: string[];

  @StringField()
  name: string;

  @ClassField(() => GroupDto, { required: false, each: true })
  groups?: GroupDto[];
}
