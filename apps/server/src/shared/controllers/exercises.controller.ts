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
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { ExerciseDto, CreateExerciseDto, UpdateExerciseDto, ExerciseQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { ExercisesService } from '../services/exercises.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiFile } from '../decorators/swagger.schema';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ParseContentPipe } from '../pipes/parse-content.pipe';

@ApiTags('EXERCISES')
@Controller()
export class ExercisesController {
  constructor(private readonly service: ExercisesService) {}

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK, { isArray: true })
  async getExercisesByQuery(@Query() query: ExerciseQueryDto) {
    const { count, exercises } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      exercises.map((exercise) => exercise.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  @ApiFile({ name: 'files', isArray: true }, { isRequired: false })
  async createExercise(
    @Body() createExerciseDto: CreateExerciseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('createExerciseDto', createExerciseDto);
    const exercise = await this.service.create(createExerciseDto, files);
    return new ResponseEntity(HttpStatus.OK, '성공', exercise.toDto());
  }

  @Get(':exerciseId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async getExercise(@Param('exerciseId') exerciseId: string) {
    const exercise = await this.service.getById(exerciseId);
    return new ResponseEntity(HttpStatus.OK, '성공', exercise.toDto());
  }

  @Patch(':exerciseId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async updateExercise(
    @Param('exerciseId') exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    const exercise = await this.service.updateById(exerciseId, updateExerciseDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ExerciseDto, exercise));
  }

  @Patch(':exerciseId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async removeExercise(@Param('exerciseId') exerciseId: string) {
    const exercise = await this.service.removeById(exerciseId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ExerciseDto, exercise));
  }

  @Delete(':exerciseId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async deleteExercise(@Param('exerciseId') exerciseId: string) {
    const exercise = await this.service.deleteById(exerciseId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ExerciseDto, exercise));
  }
}
