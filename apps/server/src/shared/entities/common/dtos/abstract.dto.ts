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
}
