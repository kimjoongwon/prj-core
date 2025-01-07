import { Profile as ProfileEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

export class Profile extends AbstractEntity implements ProfileEntity {
  depotId: string | null;
  nickname: string;
  userId: string;

  user?: User;
}
