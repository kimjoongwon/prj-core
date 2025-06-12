import { FileAssociation } from '@prisma/client';
import { ClassField, UUIDField } from '../decorator/field.decorators';
import { AbstractDto, FileDto } from '.';

export class FileAssociationDto extends AbstractDto implements FileAssociation {
  @UUIDField()
  groupId: string;

  @UUIDField()
  fileId: string;

  @ClassField(() => FileDto, { required: false, swagger: false })
  file?: FileDto;
}
