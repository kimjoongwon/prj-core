export abstract class AbstractEntity {
  id!: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
