import { User as UserEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Profile } from './profile.entity';
import { Association } from './association.entity';
import { Tenant } from './tenant.entity';
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
