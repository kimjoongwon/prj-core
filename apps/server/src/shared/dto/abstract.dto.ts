import { AbstractEntity, DateField, UUIDField } from '@shared';

export class AbstractDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @DateField({ nullable: true })
  deletedAt: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
      this.deletedAt = entity.deletedAt;
    }
  }
}
