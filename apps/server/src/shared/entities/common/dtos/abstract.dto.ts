import { DateField, UUIDField } from '../../../decorators';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @DateField({ nullable: true })
  removedAt: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity?.id;
      this.createdAt = entity?.createdAt;
      this.updatedAt = entity?.updatedAt;
      this.removedAt = entity?.removedAt;
    }
  }
}
