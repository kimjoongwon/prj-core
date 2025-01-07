import { DateField, NumberField, UUIDField } from '../../../decorators';

export class AbstractDto {
  @UUIDField()
  id: string;

  @NumberField()
  seq: number;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @DateField({ nullable: true })
  removedAt: Date;
}
