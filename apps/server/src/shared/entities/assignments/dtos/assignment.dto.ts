import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Assignment } from '../assignment.entity';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { GroupDto } from '../../groups/dtos/group.dto';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField({ nullable: true })
  groupId: string | null;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;
}
