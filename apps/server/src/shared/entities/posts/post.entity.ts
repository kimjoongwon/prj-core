import { AbstractEntity } from '../common';
import { $Enums, Post as PostEntity } from '@prisma/client';
export class Post extends AbstractEntity implements PostEntity {
  type: $Enums.PostTypes;
  title: string;
  description: string;
  content: string;
  dopotId: string;
  authorId: string;
  tenantId: string;
  classificationId: string;
  assignemntIds: string[];
}
