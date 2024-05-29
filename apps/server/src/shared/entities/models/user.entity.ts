import { User } from '@prisma/client';
import { AbstractEntity } from './common/abstract.entity';
import { TenantDto } from '../dtos/tenants/tenant.dto';
import { ProfileDto } from '../dtos/profiles/profile.dto';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  tenants?: TenantDto[];
  profiles?: ProfileDto[];
}
