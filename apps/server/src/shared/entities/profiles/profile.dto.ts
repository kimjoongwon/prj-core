import { ClassField, StringField } from '../../decorators/field.decorators';
import { UserDto } from '../users';
import { ProfileEntity } from './profile.entity';

export class ProfileDto extends ProfileEntity {
  @StringField()
  nickname: string;

  @StringField()
  userId: string;

  @ClassField(() => UserDto, { nullable: true, swagger: false, each: false })
  user?: UserDto;
}
