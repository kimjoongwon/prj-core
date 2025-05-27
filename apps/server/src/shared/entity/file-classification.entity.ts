import { FileClassification as FileClassificationEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { File } from './file.entity';
import { FileClassificationDto } from '../dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(FileClassificationDto)
export class FileClassification
  extends AbstractEntity<FileClassificationDto>
  implements FileClassificationEntity
{
  categoryId: string;
  fileId: string;

  category?: Category;
  file?: File;
}
