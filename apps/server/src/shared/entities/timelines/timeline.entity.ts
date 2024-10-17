import { AbstractDto } from '../common';
import { Timeline as TimelineEntity } from '@prisma/client';

export class Timeline extends AbstractDto implements TimelineEntity {
  sessionId: string;
  date: Date;
  tenantId: string;
}
