import { User } from '@prisma/client';
import { ProfileDto } from '../profiles/profile.dto';
import { AbstractEntity } from '../common/abstract.entity';
import { TenantDto } from '../tenants/dtos/tenant.dto';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  tenants?: TenantDto[];
  profiles?: ProfileDto[];
}
