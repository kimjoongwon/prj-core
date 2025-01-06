import { Category } from '../categories/category.entity';
import { AbstractEntity } from '../common';
import { Classification as ClassificationEntity } from '@prisma/client';
import { Post } from '../posts/post.entity';
import { Space } from '../spaces/space.entity';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
export class Classification extends AbstractEntity implements ClassificationEntity {
  categoryId: string;
  userId: string;
  postId: string;
  spaceId: string;
  roleId: string;

  category?: Category;
  role?: Role;
  user?: User;
  space?: Space;
  post?: Post;
}
