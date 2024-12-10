import { Service as ServiceEntity } from '@prisma/client';

export class Service implements ServiceEntity {
  id: string;
  seq: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
}
