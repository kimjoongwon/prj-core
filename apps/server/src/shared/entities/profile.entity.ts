import { Profile } from '@prisma/client';
import { AbstractEntity } from './common/entities/abstract.entity';

export class ProfileEntity extends AbstractEntity implements Profile {
  depotFileId: string;
  nickname: string;
  userId: string;
}
