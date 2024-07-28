import { DateField, DateFieldOptional, UUIDField } from 'src/shared/decorators';

export abstract class AbstractEntity {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField({
    nullable: true,
  })
  updatedAt: Date | null;

  @DateField({
    nullable: true,
  })
  deletedAt: Date | null;
}
