import { Ground as GroundEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  ClassField,
  StringField,
  StringFieldOptional,
  UUIDField,
  UUIDFieldOptional,
} from '../decorator';
import { SpaceDto } from './space.dto';
import { Expose } from 'class-transformer';

export class GroundDto extends AbstractDto implements GroundEntity {
  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional({ nullable: true })
  label: string | null;

  @StringField()
  address: string;

  @StringField()
  phone: string;

  @StringField()
  email: string;

  @StringField()
  businessNo: string;

  @UUIDFieldOptional({ nullable: true })
  logoImageFileId: string | null;

  @UUIDFieldOptional({ nullable: true })
  imageFileId: string | null;

  @UUIDField()
  spaceId: string;

  @ClassField(() => SpaceDto, { required: false, nullable: true })
  space?: SpaceDto | null;
}
