import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, QueryWorkspaceDto, WorkspaceDto } from '../dto';
import { Workspace } from '../entity';
import { WorkspacesRepository } from '../repository';

@Injectable()
export class WorkspacesService extends BaseService<
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  QueryWorkspaceDto,
  Workspace,
  WorkspacesRepository
> {
  constructor(repository: WorkspacesRepository) {
    super(repository);
  }
}
