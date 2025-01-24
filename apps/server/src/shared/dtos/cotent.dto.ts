import { EnumField, StringFieldOptional, UUIDField } from '../decorators';
import { AbstractDto } from './abstract.dto';
import { $Enums, Content as ContentEntity } from '@prisma/client';

export class ContentDto extends AbstractDto implements ContentEntity {
  @StringFieldOptional({ nullable: true })
  title: string | null;

  @StringFieldOptional({ nullable: true })
  description: string | null;

  @UUIDField({ nullable: true })
  dopotId: string;

  @EnumField(() => $Enums.TextTypes, { nullable: true, default: $Enums.TextTypes.HTML })
  type: $Enums.TextTypes;

  @StringFieldOptional({ nullable: true })
  text: string;
}
