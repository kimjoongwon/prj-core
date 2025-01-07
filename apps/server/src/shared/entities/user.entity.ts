import { User as UserEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Tenancy } from './tenancy.entity';
import { Classification } from './classification.entity';
// import { Post } from './post.entity';
import { Profile } from './profile.entity';
import { Association } from './association.entity';
import { Tenant } from './tenant.entity';

export class User extends AbstractEntity implements UserEntity {
  name: string;
  email: string;
  phone: string;
  password: string;
  tenancyId: string;
  classificationId: string | null;

  // posts?: Post[];
  profiles?: Profile[];
  tenants?: Tenant[];
  associations?: Association[];
  classification?: Classification;
  tenancy?: Tenancy;
}
