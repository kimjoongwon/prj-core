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
import { SubjectDto, CreateSubjectDto, UpdateSubjectDto, SubjectQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { SubjectsService } from '../services/subjects.service';

@ApiTags('SUBJECTS')
@Controller()
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.service.create(createSubjectDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SubjectDto, subject));
  }

  @Get(':subjectId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async getSubject(@Param('subjectId') subjectId: string) {
    const subject = await this.service.getUnique({
      where: { id: subjectId },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SubjectDto, subject));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async removeSubjects(@Body() subjectIds: string[]) {
    const subjects = await this.service.updateMany({
      where: { id: { in: subjectIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', subjects.count);
  }

  @Patch(':subjectId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async updateSubject(
    @Param('subjectId') subjectId: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.service.update({
      where: { id: subjectId },
      data: updateSubjectDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SubjectDto, subject));
  }

  @Patch(':subjectId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async removeSubject(@Param('subjectId') subjectId: string) {
    const subject = await this.service.remove(subjectId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SubjectDto, subject));
  }

  @Delete(':subjectId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK)
  async deleteSubject(@Param('subjectId') subjectId: string) {
    const subject = await this.service.deleteById(subjectId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SubjectDto, subject));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
  async getSubjectsByQuery(@Query() query: SubjectQueryDto) {
    const { count, subjects } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      subjects.map((subject) => subject.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
