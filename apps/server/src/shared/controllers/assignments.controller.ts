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
import { AssignmentDto, CreateAssignmentDto, AssignmentQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { AssignmentsService } from '../services/assignments.service';
import { ApiTags } from '@nestjs/swagger';

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
    return new ResponseEntity(HttpStatus.OK, '성공', assignment.toDto());
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
  async getAssignmentsByQuery(@Query() query: AssignmentQueryDto) {
    const { count, assignments } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      assignments.map((assignment) => assignment.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}