import { ClassField, UUIDField } from '../../../decorators';
import { CategoryDto } from '../../categories';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ReservationDto } from '../../reservations/dto/reservation.dto';
import { ServiceDto } from '../../services/dtos/service.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { Classification } from '../classification.entity';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField()
  categoryId: string;

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

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;
}
