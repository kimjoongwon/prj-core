import { $Enums, Service as ServiceEntity } from '@prisma/client';

export class Service implements ServiceEntity {
  name: string;
  id: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
}
