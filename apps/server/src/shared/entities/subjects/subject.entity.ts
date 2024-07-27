import { AbstractEntity } from '../common';
import { Prisma, Subject as SubjectEntity } from '@prisma/client';

export class Subject extends AbstractEntity implements SubjectEntity {
  name: string;
  fields: Prisma.JsonValue[];
}
