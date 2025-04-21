import { Workspace as WorkspaceEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  EmailField,
  StringField,
  StringFieldOptional,
  UUIDField,
  UUIDFieldOptional,
} from '../decorators/field.decorators';

export class WorkspaceDto extends AbstractDto implements WorkspaceEntity {
  @StringFieldOptional({ nullable: true })
  label: string | null;

  @StringField({
    description: '작업공간명',
  })
  name: string;

  @StringField({
    description: '작업공간 주소',
    example: '서울시 강남구 테헤란로 123',
  })
  address: string;

  @StringField({
    description: '전화번호',
    example: '010-1234-5678',
  })
  phone: string;

  @EmailField({
    description: '이메일',
    example: 'g4C7o@example.com',
  })
  email: string;

  @StringField({
    description: '사업자등록번호',
    example: '123-45-67890',
  })
  businessNo: string;

  @UUIDFieldOptional({
    nullable: true,
    description: '로고 이미지 ID',
    example: '3a8f7b2d-5e9c-4e3b-8c4f-0d7f1a1e9c6a',
  })
  logoImageDepotId: string | null;

  @UUIDField({
    description: '작업공간 ID',
    example: '3a8f7b2d-5e9c-4e3b-8c4f-0d7f1a1e9c6a',
  })
  spaceId: string;
}
