import { DateField, NumberField, UUIDField } from '../../../decorators/field.decorators';

export abstract class AbstractEntity {
  @UUIDField()
  id: string;

  @NumberField()
  seq: number;

  @DateField()
  createdAt: Date;

  @DateField({
    nullable: true,
  })
  updatedAt: Date | null;

  @DateField({
    nullable: true,
  })
  removedAt: Date | null;
}
