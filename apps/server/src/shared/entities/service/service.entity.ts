import { Service as ServiceEntity } from '@prisma/client';

export enum SERVICE_NAME {
  SPACE = 'SPACE',
  USER = 'USER',
  SETTING = 'SETTING',
}

export class Service implements ServiceEntity {
  id: string;
  label: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
}
