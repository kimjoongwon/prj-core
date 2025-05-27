import { File } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, NumberField, StringField, UUIDField } from '../decorator';
import { TenantDto } from './tenant.dto';
import { ClassificationDto } from './user-classification.dto';

export class FileDto extends AbstractDto implements File {
  @UUIDField()
  tenantId: string;

  @StringField()
  name: string;

  @UUIDField()
  depotId: string;

  @NumberField()
  size: number;

  @StringField()
  mimeType: string;

  @StringField()
  url: string;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;

  @ClassField(() => ClassificationDto, { required: false })
  classification?: ClassificationDto;
}
