import { AbstractDto } from '../common';
import { Timeline as TimelineEntity } from '@prisma/client';

export class Timeline extends AbstractDto implements TimelineEntity {
  timelineItemId: string;
  name: string;
  sessionId: string;
  date: Date;
}
