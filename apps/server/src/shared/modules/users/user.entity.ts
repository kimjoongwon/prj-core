import { AbstractEntity } from '../../entities';
import { User } from '@prisma/client';
import { TenantDto } from '../tenants/dto/tenant.dto';
import { ProfileDto } from '../profiles/dto/profile.dto';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  tenants?: TenantDto[];
  profiles?: ProfileDto[];
}
