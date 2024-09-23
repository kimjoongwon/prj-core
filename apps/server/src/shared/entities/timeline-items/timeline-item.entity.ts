import { AbstractEntity } from '../common/abstract.entity';
import { TimelineItem as TimelineEntity } from '@prisma/client';

export class TimelineItem extends AbstractEntity implements TimelineEntity {
  tenantId: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  description: string;
  address: string;
  maxCapacity: number;
  minCapacity: number;
  timelineId: string | null;
}
