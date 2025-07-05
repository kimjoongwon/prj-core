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
import { Auth, ApiResponseEntity } from '../decorator';
import { RoutineDto, CreateRoutineDto, UpdateRoutineDto, QueryRoutineDto } from '../dto';
import { PageMetaDto } from '../dto/query/page-meta.dto';
import { ResponseEntity } from '../entity/response.entity';
import { RoutinesService } from '../service/routines.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ROUTINE')
@Controller()
export class RoutinesController {
  constructor(private readonly service: RoutinesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    const routine = await this.service.create(createRoutineDto);
    return new ResponseEntity(HttpStatus.OK, '성공', routine.toDto());
  }

  @Get(':routineId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async getRoutine(@Param('routineId') routineId: string) {
    const routine = await this.service.getById(routineId);
    return new ResponseEntity(HttpStatus.OK, '성공', routine.toDto());
  }

  @Patch(':routineId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async updateRoutine(
    @Param('routineId') routineId: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    const routine = await this.service.updateById(routineId, updateRoutineDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoutineDto, routine));
  }

  @Patch(':routineId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async removeRoutine(@Param('routineId') routineId: string) {
    const routine = await this.service.removeById(routineId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoutineDto, routine));
  }

  @Delete(':routineId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async deleteRoutine(@Param('routineId') routineId: string) {
    const routine = await this.service.deleteById(routineId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoutineDto, routine));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
  async getRoutinesByQuery(@Query() query: QueryRoutineDto) {
    const { count, items } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      items.map((item) => item.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
