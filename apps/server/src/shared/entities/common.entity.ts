import { StringField } from '@shared';

export class CommonEntity {
  @StringField()
  id: string;

  @StringField()
  createdAt: Date;

  @StringField()
  updatedAt: Date;

  @StringField({ nullable: true })
  deletedAt: Date | null;
}
