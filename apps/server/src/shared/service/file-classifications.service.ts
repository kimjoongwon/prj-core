import { Injectable } from '@nestjs/common';
import { FileClassificationsRepository } from '../repository/file-classifications.repository';
import { BaseService } from './base.service';
import {
  CreateFileClassificationDto,
  FileClassification,
  UpdateFileClassificationDto,
} from '@shared/schema';

@Injectable()
export class FileClassificationsService extends BaseService<
  CreateFileClassificationDto,
  UpdateFileClassificationDto,
  any,
  FileClassification,
  FileClassificationsRepository
> {
  constructor(readonly repository: FileClassificationsRepository) {
    super(repository);
  }
}
