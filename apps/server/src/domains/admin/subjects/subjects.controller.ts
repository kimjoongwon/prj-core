import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  CreateSubjectDto,
  ResponseEntity,
  SubjectDto,
  SubjectPageQueryDto,
  SubjectsService,
  UpdateSubjectDto,
} from '@shared';

@ApiTags('subjects')
@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiResponseEntity(SubjectDto, { isArray: true })
  async getSubjectsByPageQuery(pageQuery: SubjectPageQueryDto) {
    const subjects = await this.subjectsService.getManyByPageQuery(pageQuery);
    return new ResponseEntity(
      HttpStatus.OK,
      '조회 성공',
      subjects.map((subject) => new SubjectDto(subject)),
    );
  }

  @Get(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async getSubjectById(@Param('subjectId') id: string) {
    const subject = await this.subjectsService.getOneById(id);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', new SubjectDto(subject));
  }

  @Patch(':subjectId')
  @ApiResponseEntity(SubjectDto)
  async updateSubjectById(
    @Param('subjectId') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectsService.updateById(id, updateSubjectDto);
    return new ResponseEntity(HttpStatus.OK, '수정 성공', new SubjectDto(subject));
  }

  @Delete(':subjectId')
  async removeSubjectById(@Param('subjectId') id: string) {
    const subject = await this.subjectsService.remove(id);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', new SubjectDto(subject));
  }
}
