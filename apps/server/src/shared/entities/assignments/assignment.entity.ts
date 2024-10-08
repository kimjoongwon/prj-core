import { AbstractEntity } from '../common';
import { Assignment as AssignmentEntity } from '@prisma/client';
export class Assignment extends AbstractEntity implements AssignmentEntity {
  groupId: string;
  serviceId: string;
  serviceItemId: string;
}
