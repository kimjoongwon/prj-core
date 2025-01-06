import { AbstractEntity } from '../common';
import { Association as AssociationEntity, Group } from '@prisma/client';
export class Association extends AbstractEntity implements AssociationEntity {
  userId: string;
  postId: string;
  spaceId: string;
  groupId: string;
  group?: Group;
}
