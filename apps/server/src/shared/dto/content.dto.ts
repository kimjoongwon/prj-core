import { EnumField, StringField, StringFieldOptional, UUIDField } from '../decorator';
import { AbstractDto } from './abstract.dto';
import { $Enums, Content as ContentEntity } from '@prisma/client';
import { CreateContentDto } from './create';
import { ValidationRecord } from '@shared/specs';

export const defaultCreateContentDto: CreateContentDto = {
  depotId: '',
  title: '',
  description: '하하하',
  type: 'Textarea',
  text: '',
  tenantId: '',
};

export const createContentDtoValidationObject: ValidationRecord<CreateContentDto> = {
  depotId: {
    required: { value: true, message: '디포 ID는 필수입니다.' },
  },
  title: {
    required: {
      value: true,
      message: '제목은 필수입니다.',
    },
  },
  description: {
    required: {
      value: true,
      message: '설명은 필수입니다.',
    },
  },
  type: {
    required: {
      value: true,
      message: '유형은 필수입니다.',
    },
  },
  text: {
    required: {
      value: true,
      message: '텍스트는 필수입니다.',
    },
  },
  tenantId: {
    required: {
      value: true,
      message: '테넌트 ID는 필수입니다.',
    },
  },
};

export class ContentDto extends AbstractDto implements ContentEntity {
  @UUIDField({
    errorMessage: createContentDtoValidationObject.depotId.required.message,
    nullable: true,
  })
  depotId: string | null;

  @StringField({
    nullable: true,
    errorMessage: createContentDtoValidationObject.title.required.message,
  })
  title: string | null;

  @StringField({
    nullable: true,
    errorMessage: createContentDtoValidationObject.description.required.message,
  })
  description: string | null;

  @EnumField(() => $Enums.TextTypes, { nullable: true, default: $Enums.TextTypes.Textarea })
  type: $Enums.TextTypes;

  @StringFieldOptional({
    errorMessage: createContentDtoValidationObject.text.required.message,
    default: defaultCreateContentDto.text,
  })
  text: string;

  @UUIDField()
  tenantId: string;
}
