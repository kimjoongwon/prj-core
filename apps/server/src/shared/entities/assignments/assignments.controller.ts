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
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '../common/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import { TenancyDto } from '../tenancies';
import {
  CreateAssignmentDto,
  AssignmentDto,
  UpdateAssignmentDto,
  AssignmentQueryDto,
} from '../assignments/dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { AssignmentsService } from './assignments.service';

@ApiTags('ADMIN_ASSIGNMENTS')
@Controller()
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    const assignment = await this.service.create({
      data: createAssignmentDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Get(':assignmentId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async getAssignment(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.getUnique({ where: { id: assignmentId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async removeAssignments(@Body() assignmentIds: string[]) {
    const assignments = await this.service.removeMany(assignmentIds);
    return new ResponseEntity(HttpStatus.OK, '성공', assignments.count);
  }

  @Patch(':assignmentId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const assignment = await this.service.update({
      where: { id: assignmentId },
      data: updateAssignmentDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Patch(':assignmentId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async removeAssignment(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.remove(assignmentId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssignmentDto, assignment));
  }

  @Delete(':assignmentId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssignmentDto, HttpStatus.OK)
  async deleteAssignment(@Param('assignmentId') assignmentId: string) {
    const assignment = await this.service.delete(assignmentId);
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
      assignments.map((assignment) => plainToInstance(AssignmentDto, assignment)),
      new PageMetaDto({
        pageQueryDto: query,
        itemCount: count,
      }),
    );
  }
}
