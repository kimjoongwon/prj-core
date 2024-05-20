import { DateField, StringField } from '@shared';

export abstract class AbstractEntity {
  @StringField()
  id!: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @DateField({ nullable: true })
  deletedAt: Date | null;
}
