import { $Enums, Role as RoleEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';

export class Role extends AbstractEntity implements RoleEntity {
  classificationId: string;
  name: $Enums.Roles;
}
