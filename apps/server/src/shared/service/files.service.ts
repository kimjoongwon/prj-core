import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repository';
import { CreateFileDto } from '../dto/create/create-file.dto';
import { BaseService } from './base.service';
import { UpdateFileDto } from '../dto/update/update-file.dto';
import { File } from '../entity';

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
