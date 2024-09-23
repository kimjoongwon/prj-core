import { AbstractEntity } from '../common';
import { $Enums, Post as PostEntity } from '@prisma/client';
export class Post extends AbstractEntity implements PostEntity {
  type: $Enums.PostTypes;
  title: string;
  content: string;
  authorId: string;
  serviceId: string;
}
