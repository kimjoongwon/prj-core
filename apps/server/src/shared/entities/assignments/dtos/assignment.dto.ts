import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Assignment } from '../assignment.entity';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { UserDto } from '../../users';
import { GroupDto } from '../../groups';
import { ReservationDto } from '../../reservations/dto';
import { SpaceDto } from '../../spaces';
import { ServiceDto } from '../../services';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField()
  groupId: string;

  @UUIDField()
  serviceId: string;

  @UUIDField()
  serviceItemId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => ReservationDto, { required: false })
  reservation?: ReservationDto;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;
}
