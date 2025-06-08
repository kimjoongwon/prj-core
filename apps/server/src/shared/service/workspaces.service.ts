import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, QueryWorkspaceDto, WorkspaceDto } from '../dto';
import { Workspace } from '../entity';
import { WorkspacesRepository } from '../repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkspacesService extends BaseService<
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  QueryWorkspaceDto,
  Workspace,
  WorkspacesRepository,
  Prisma.WorkspaceInclude
> {
  constructor(repository: WorkspacesRepository) {
    super(repository);
  }
}
