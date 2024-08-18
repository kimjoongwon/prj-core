import { AbstractEntity } from '../common/abstract.entity';
import { TimelineItem as TimelineEntity } from '@prisma/client';

export class TimelineItem extends AbstractEntity implements TimelineEntity {
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  timelineId: string;
  description: string;
  address: string;
  maxCapacity: number;
  minCapacity: number;
}
