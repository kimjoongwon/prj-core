import { StringField } from '../../decorators/field.decorators';
import { ProfileEntity } from './profile.entity';

export class ProfileDto extends ProfileEntity {
  @StringField()
  nickname: string;

  @StringField()
  userId: string;
}
