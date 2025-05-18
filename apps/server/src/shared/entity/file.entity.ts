import { UseDto } from '../decorator/use-dto.decorator';
import { FileDto } from '../dto';
import { AbstractEntity } from './abstract.entity';
import { File as FileEntity } from '@prisma/client';

@UseDto(FileDto)
export class File extends AbstractEntity<FileDto> implements FileEntity {
  size: number;
  mimeType: string;
  url: string;
  tenantId: string;
  name: string;
  depotId: string;
}
