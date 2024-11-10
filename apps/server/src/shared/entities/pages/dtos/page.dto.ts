import { Prisma } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Page } from '../page.entity';
import { StringField, StringFieldOptional, UUIDField } from '../../../decorators';

export class PageDto extends AbstractDto implements Page {
  @StringFieldOptional({ nullable: true })
  params: Prisma.JsonValue | null;

  @StringField()
  name: string;

  @StringField()
  pathname: string;
}
