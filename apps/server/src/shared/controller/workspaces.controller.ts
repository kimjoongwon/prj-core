import { Controller, Type } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AutoBaseController } from './auto-base.controller';
import { CrudController } from './crud.decorator';
import { CreateWorkspaceDto, UpdateWorkspaceDto, QueryWorkspaceDto, WorkspaceDto } from '../dto';
import { WorkspacesService } from '../service';

@ApiTags('WORKSPACES')
@CrudController({
  entityName: 'Workspace',
  tag: 'WORKSPACES'
})
@Controller()
export class WorkspacesController extends AutoBaseController<
  WorkspaceDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  QueryWorkspaceDto,
  WorkspacesService
> {
  protected readonly service: WorkspacesService;
  protected readonly dtoClass: Type<WorkspaceDto> = WorkspaceDto;
  protected readonly entityName: string = 'Workspace';

  constructor(service: WorkspacesService) {
    super();
    this.service = service;
  }
}
