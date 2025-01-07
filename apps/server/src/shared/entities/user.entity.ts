import { User as UserEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Tenancy } from './tenancy.entity';
import { Classification } from './classification.entity';

export class User extends AbstractEntity implements UserEntity {
  name: string;
  email: string;
  phone: string;
  password: string;
  tenancyId: string;
  classificationId: string | null;

  tenancy?: Tenancy;
  classification?: Classification;
}
