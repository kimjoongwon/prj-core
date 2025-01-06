import { AbstractEntity } from '../common';
import { Assignment as AssignmentEntity, Group } from '@prisma/client';
export class Assignment extends AbstractEntity implements AssignmentEntity {
  userId: string;
  postId: string;
  spaceId: string;
  groupId: string;
  group?: Group;
}
