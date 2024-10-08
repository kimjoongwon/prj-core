import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Assignment } from '../assignment.entity';
import { UUIDField } from '../../../decorators/field.decorators';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField()
  groupId: string;

  @UUIDField()
  serviceId: string;

  @UUIDField()
  serviceItemId: string;
}
