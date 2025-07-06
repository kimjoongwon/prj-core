import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { CreateFileDto, UpdateFileDto, File } from '@shared/schema';
import { FilesRepository } from '../repository/files.repository';

@Injectable()
export class FilesService extends BaseService<
  CreateFileDto,
  UpdateFileDto,
  any,
  File,
  FilesRepository
> {
  constructor(readonly repository: FilesRepository) {
    super(repository);
  }
}
