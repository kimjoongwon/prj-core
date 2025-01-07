import { AbstractEntity } from './common';
import { Association as AssociationEntity, Group } from '@prisma/client';
import { Space } from '../spaces/space.entity';
import { Post } from './posts/post.entity';
import { User } from './user.entity';
import { Service } from './service.entity';
export class Association extends AbstractEntity implements AssociationEntity {
  userId: string;
  postId: string;
  spaceId: string;
  groupId: string;
  serviceId: string;
  group?: Group;
  user?: User;
  post?: Post;
  space?: Space;
  service?: Service;
}
