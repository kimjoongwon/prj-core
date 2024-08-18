import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoints,
  ApiResponseEntity,
  CreateSubjectDto,
  ResponseEntity,
  SubjectDto,
  SubjectPageQueryDto,
  SubjectService,
  UpdateSubjectDto,
} from '@shared';

@ApiTags('ADMIN_SUBJECTS')
@Controller(ApiEndpoints.ADMIN_SUBJECTS)
export class SubjectsController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @ApiResponseEntity(SubjectDto, { isArray: true })
  async getSubjectsByPageQuery(pageQuery: SubjectPageQueryDto) {
    const subjects = await this.subjectService.getManyByPageQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      subjects.map((subject) => new SubjectDto(subject)),
    );
  }

  @Get(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async getSubjectById(@Param('subjectId') id: string) {
    const subject = await this.subjectService.getOneById(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new SubjectDto(subject));
  }

  @Patch(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async updateSubjectById(
    @Param('subjectId') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectService.updateById(id, updateSubjectDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new SubjectDto(subject));
  }

  @Delete(':subjectId')
  async removeSubjectById(@Param('subjectId') id: string) {
    const subject = await this.subjectService.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new SubjectDto(subject));
  }
}
