import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';
import { User } from '@coc/database';

@UseDto(UserDto)
export class UserEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements User
{
  email: string;
  password: string;
  deletedAt: Date;
  name: string;
}
