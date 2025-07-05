import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repository';
import { BaseService } from './base.service';
import { CreateFileDto, UpdateFileDto, File } from '@shared/schema';

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
