import { Profile } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class ProfileEntity extends AbstractEntity implements Profile {
  nickname: string;
  userId: string;
}
