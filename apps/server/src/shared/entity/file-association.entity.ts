import { FileAssociation as FileAssociationEntity, File } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { FileAssociationDto } from '../dto/file-association.dto';

@UseDto(FileAssociationDto)
export class FileAssociation extends AbstractEntity<FileAssociationDto> implements FileAssociationEntity {
  userId: string;
  fileId: string;

  file?: File;
}
