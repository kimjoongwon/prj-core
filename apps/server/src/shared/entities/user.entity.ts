import { AbstractEntity } from '.';
import { User } from '@prisma/client';
import { TenantDto } from '../dtos/tenant.dto';
import { ProfileDto } from '../dtos/profile.dto';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  tenants?: TenantDto[];
  profiles?: ProfileDto[];
}
