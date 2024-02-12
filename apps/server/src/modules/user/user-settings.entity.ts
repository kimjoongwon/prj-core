import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';

@UseDto(UserDto)
export class UserSettingsEntity extends AbstractEntity<
  UserDto,
  UserDtoOptions
> {
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  userId?: string;
}
