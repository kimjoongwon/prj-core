import { AbstractEntity } from '../common';
import { Program as ProgramEntity } from '@prisma/client';
export class Program extends AbstractEntity implements ProgramEntity {
  postId: string;
  timelineItemId: string;
  address: string;
  maxCapacity: number;
  minCapacity: number;
  tenantId: string;
}
