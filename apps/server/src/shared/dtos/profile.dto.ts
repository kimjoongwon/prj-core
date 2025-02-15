import { Profile } from '@prisma/client';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { User } from '../entities/user.entity';
import { AbstractDto } from './abstract.dto';

export class ProfileDto extends AbstractDto implements Profile {
  @StringField()
  name: string;

  @UUIDField()
  depotId: string;

  @StringField()
  nickname: string;

  @StringField()
  userId: string;

  @ClassField(() => User, { required: false })
  user?: User;
}
