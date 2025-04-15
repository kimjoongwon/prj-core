import { Gym as GymEntity } from '@prisma/client';
import { ClassField, StringField, StringFieldOptional, UUIDField } from '../decorators';
import { AbstractDto } from './abstract.dto';
import { DepotDto } from './depot.dto';
import { SpaceDto } from './space.dto';

export class GymDto extends AbstractDto implements GymEntity {
  @StringField()
  name: string;

  @StringFieldOptional()
  label: string;

  @StringField()
  businessNo: string;

  @UUIDField()
  spaceId: string;

  @StringField()
  address: string;

  @StringField()
  phone: string;

  @StringField()
  email: string;

  @StringField()
  businessNumber: string;

  @UUIDField()
  depotId: string;

  @ClassField(() => DepotDto, { required: false })
  depot?: DepotDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
