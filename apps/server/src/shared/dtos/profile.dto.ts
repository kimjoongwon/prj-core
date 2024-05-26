import { StringField } from '../decorators';
import { ProfileEntity } from '../entities';

export class ProfileDto extends ProfileEntity {
  @StringField()
  nickname: string;

  @StringField()
  userId: string;
}
