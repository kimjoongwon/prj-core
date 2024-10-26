import { AbstractEntity } from '../common';
import { Lecture as LectureEntity } from '@prisma/client';
export class Lecture extends AbstractEntity implements LectureEntity {
  timlineItemId: string;
  exerciseId: string;
}
