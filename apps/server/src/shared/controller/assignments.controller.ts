import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentDto, type CreateAssignmentDto, type QueryAssignmentDto } from '@shared/schema';
import { PageMetaDto } from '@shared/schema';
import { ResponseEntity } from '@shared/schema';
import { plainToInstance } from 'class-transformer';
import { ApiResponseEntity, Auth } from '../decorator';
import type { AssignmentsService } from '../service/assignments.service';

@ApiTags('ASSIGNMENTS')
@Controller()
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    const assignment = await this.service.create(createAssignmentDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Get(':assignmentId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async getAssignment(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.getById(assignmentId);
    return new ResponseEntity(HttpStatus.OK, '성공', assignment?.toDto?.() ?? assignment);
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async removeAssignments(@Body() assignmentIds: string[]) {
    const assignments = await this.service.removeManyByIds(assignmentIds);
    return new ResponseEntity(HttpStatus.OK, '성공', assignments.count);
  }

  @Patch(':assignmentId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async removeAssignmentById(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.removeById(assignmentId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Delete(':assignmentId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async deleteAssignment(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.deleteById(assignmentId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK, { isArray: true })
  async getAssignmentsByQuery(@Query() query: QueryAssignmentDto) {
    const { count, assignments } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      assignments.map((assignment) => assignment?.toDto?.() ?? assignment),
      new PageMetaDto(query.skip, query.take, count)
    );
  }
}
