import { AbstractDto } from '../common';
import { Timeline as TimelineEntity } from '@prisma/client';

export class Timeline extends AbstractDto implements TimelineEntity {
  name: string;
  tenantId: string;
  sessionId: string;
}
