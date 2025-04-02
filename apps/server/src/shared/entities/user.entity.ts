import { Association, Profile, Tenant, User as UserEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { UserDto } from '../dtos';

@UseDto(UserDto)
export class User extends AbstractEntity<UserDto> implements UserEntity {
  name: string;
  email: string;
  phone: string;
  password: string;

  profiles?: Profile[];
  tenants?: Tenant[];
  associations?: Association[];
}
