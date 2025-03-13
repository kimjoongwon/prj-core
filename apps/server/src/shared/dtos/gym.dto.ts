import { Gym as GymEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, StringField, UUIDField } from '../decorators';
import { DepotDto } from './depot.dto';
import { SpaceDto } from './space.dto';

export class GymDto extends AbstractDto implements GymEntity {
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
