import { AbstractEntity } from '../common/abstract.entity';
import { Lecture as LectureEntity } from '@prisma/client';

export class Lecture extends AbstractEntity implements LectureEntity {
  postId: string;
  sessionId: string;
  tenantId: string;
}
