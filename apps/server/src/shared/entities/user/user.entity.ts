import { User } from '@prisma/client';
import { ProfileDto } from '../profile/profile.dto';
import { AbstractEntity } from '../common/abstract.entity';
import { TenantDto } from '../tenant/dtos/tenant.dto';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  tenants?: TenantDto[];
  profiles?: ProfileDto[];
}
