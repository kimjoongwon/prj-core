import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '../../decorators';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { ResponseEntity } from '../common/response.entity';
import { CreateSubjectDto, SubjectDto, SubjectPageQueryDto, UpdateSubjectDto } from './dto';
import { SubjectsService } from './subjects.service';
import { plainToInstance } from 'class-transformer';

@ApiTags('ADMIN_SUBJECTS')
@Controller(ApiEndpoints.ADMIN_SUBJECTS)
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.service.create({ data: createSubjectDto });
  }

  @Get()
  @ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
  async getSubjectsByPageQuery(pageQuery: SubjectPageQueryDto) {
    const subjects = await this.service.getManyByPageQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      subjects.map((subject) => plainToInstance(SubjectDto, subject)),
    );
  }

  @Get(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async getSubjectById(@Param('subjectId') id: string) {
    const subject = await this.service.getOneById(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', plainToInstance(SubjectDto, subject));
  }

  @Patch(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async updateSubjectById(
    @Param('subjectId') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.service.updateById(id, updateSubjectDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', plainToInstance(SubjectDto, subject));
  }

  @Delete(':subjectId')
  async removeSubjectById(@Param('subjectId') id: string) {
    const subject = await this.service.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', plainToInstance(SubjectDto, subject));
  }
}
