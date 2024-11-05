import { AbstractEntity } from '../common';
import { $Enums, Role as RoleEntity } from '@prisma/client';

export class Role extends AbstractEntity implements RoleEntity {
  assignmentIds: string[];
  classificationId: string;
  name: $Enums.Roles;
}
