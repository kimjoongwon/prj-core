import { AbstractEntity } from '../common';
import { Subject as SubjectEntity } from '@prisma/client';

export class Subject extends AbstractEntity implements SubjectEntity {
  name: string;
}
