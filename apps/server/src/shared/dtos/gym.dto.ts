import { Gym as GymEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorators';

export class GymDto extends AbstractDto implements GymEntity {
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
}
