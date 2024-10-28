import { AbstractEntity } from '../common';
import { Email as EmailEntity } from '@prisma/client';
export class Email extends AbstractEntity implements EmailEntity {
  tenantId: string;
  toUserIds: string[];
  fromUserId: string;
  postId: string;
  sentAt: Date;
}
