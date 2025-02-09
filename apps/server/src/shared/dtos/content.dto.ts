import { EnumField, StringFieldOptional, UUIDField, UUIDFieldOptional } from '../decorators';
import { AbstractDto } from './abstract.dto';
import { $Enums, Content as ContentEntity } from '@prisma/client';

export class ContentDto extends AbstractDto implements ContentEntity {
  @UUIDField()
  authorId: string;

  @StringFieldOptional({ nullable: true, label: '제목', placeholder: '제목을 입력해주세요' })
  title: string | null;

  @StringFieldOptional({ nullable: true, label: '설명', placeholder: '설명을 입력해주세요' })
  description: string | null;

  @UUIDFieldOptional({ nullable: true })
  dopotId: string;

  @EnumField(() => $Enums.TextTypes, { nullable: true, default: $Enums.TextTypes.Textarea })
  type: $Enums.TextTypes;

  @StringFieldOptional({ nullable: true, label: '내용', placeholder: '내용을 입력해주세요' })
  text: string;
}
