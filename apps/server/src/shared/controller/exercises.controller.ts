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
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { 
  ExerciseDto, 
  CreateExerciseDto, 
  UpdateExerciseDto, 
  QueryExerciseDto,
  PageMetaDto,
  ResponseEntity 
} from '@shared/schema';
import { ExercisesService } from '../service/exercises.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('EXERCISES')
@Controller()
export class ExercisesController {
  constructor(private readonly service: ExercisesService) {}

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK, { isArray: true })
  async getExercisesByQuery(@Query() query: QueryExerciseDto) {
    const { count, exercises } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      exercises.map((exercise) => exercise?.toDto?.() ?? exercise),
      new PageMetaDto(query.skip, query.take, count),
    );
  }

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    const exercise = await this.service.create(createExerciseDto);
    return new ResponseEntity(HttpStatus.OK, '성공', exercise?.toDto?.() ?? exercise);
  }

  @Get(':exerciseId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ExerciseDto, HttpStatus.OK)
  async getExercise(@Param('exerciseId') exerciseId: string) {
    const exercise = await this.service.getById(exerciseId);
    return new ResponseEntity(HttpStatus.OK, '성공', exercise?.toDto?.() ?? exercise);
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
