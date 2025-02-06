import { EnumField, StringFieldOptional, UUIDField, UUIDFieldOptional } from '../decorators';
import { AbstractDto } from './abstract.dto';
import { $Enums, Content as ContentEntity } from '@prisma/client';

export class ContentDto extends AbstractDto implements ContentEntity {
  @UUIDField()
  authorId: string;

  @StringFieldOptional({ nullable: true })
  title: string | null;

  @StringFieldOptional({ nullable: true })
  description: string | null;

  @UUIDFieldOptional({ nullable: true })
  dopotId: string;

  @EnumField(() => $Enums.TextTypes, { nullable: true, default: $Enums.TextTypes.Textarea })
  type: $Enums.TextTypes;

  @StringFieldOptional({ nullable: true })
  text: string;
}
