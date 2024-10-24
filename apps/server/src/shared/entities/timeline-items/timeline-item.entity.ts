import { AbstractEntity } from '../common/abstract.entity';
import { TimelineItem as TimelineEntity } from '@prisma/client';

export class TimelineItem extends AbstractEntity implements TimelineEntity {
  sessionId: string;
  tenantId: string;
  startDateTime: Date;
  endDateTime: Date;
}
