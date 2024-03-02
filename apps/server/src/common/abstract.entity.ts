export abstract class AbstractEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
