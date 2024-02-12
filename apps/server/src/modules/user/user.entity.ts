import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { PostEntity } from '../post/post.entity';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  firstName!: string | null;
  lastName!: string | null;
  role!: RoleType;
  email!: string | null;
  password!: string | null;
  phone!: string | null;
  avatar!: string | null;
  settings?: UserSettingsEntity;
  posts?: PostEntity[];
}
