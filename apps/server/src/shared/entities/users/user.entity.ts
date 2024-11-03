import { User } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class UserEntity extends AbstractEntity implements User {
  assignmentIds: string[];
  classificationId: string;
  email: string;
  name: string;
  phone: string;
  password: string;
}
