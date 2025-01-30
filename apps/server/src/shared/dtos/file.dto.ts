import { File } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { NumberField, StringField, UUIDField } from '../decorators';

export class FileDto extends AbstractDto implements File {
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

  @UUIDField()
  tenancyId: string;
}
