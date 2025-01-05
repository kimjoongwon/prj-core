import { AbstractEntity } from '../common';
import { Assignment as AssignmentEntity, Group } from '@prisma/client';
export class Assignment extends AbstractEntity implements AssignmentEntity {
  groupId: string;
  group?: Group;
}
