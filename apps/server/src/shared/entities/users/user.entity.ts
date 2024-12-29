import { User } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class UserEntity extends AbstractEntity implements User {
  email: string;
  name: string;
  phone: string;
  password: string;
  spaceId: string;
  tenantId: string;
  assignmentIds: string[];
  classificationId: string;
}
