import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { WorkspaceDto, CreateWorkspaceDto, WorkspaceQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { WorkspacesService } from '../services/workspaces.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACES')
@Controller()
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK)
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = await this.service.create(createWorkspaceDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(WorkspaceDto, workspace));
  }

  @Get(':workspaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK)
  async getWorkspace(@Param('workspaceId') workspaceId: string) {
    const workspace = await this.service.getById(workspaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', workspace.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK)
  async removeWorkspaces(@Body() workspaceIds: string[]) {
    const workspaces = await this.service.removeManyByIds(workspaceIds);
    return new ResponseEntity(HttpStatus.OK, '성공', workspaces.count);
  }

  @Patch(':workspaceId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK)
  async removeWorkspaceById(@Param('workspaceId') workspaceId: string) {
    const workspace = await this.service.removeById(workspaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(WorkspaceDto, workspace));
  }

  @Delete(':workspaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK)
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    const workspace = await this.service.deleteById(workspaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(WorkspaceDto, workspace));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(WorkspaceDto, HttpStatus.OK, { isArray: true })
  async getWorkspacesByQuery(@Query() query: WorkspaceQueryDto) {
    const { count, workspaces } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      workspaces.map((workspace) => workspace.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}