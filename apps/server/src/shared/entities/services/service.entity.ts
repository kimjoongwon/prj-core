import { $Enums, Service as ServiceEntity } from '@prisma/client';

export enum SERVICE_NAME {
  SPACE = 'SPACE',
  USER = 'USER',
  SETTING = 'SETTING',
}

export class Service implements ServiceEntity {
  name: $Enums.SERVICE_NAME;
  id: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
}
