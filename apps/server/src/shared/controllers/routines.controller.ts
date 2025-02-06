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
import { Auth, ApiResponseEntity } from '../decorators';
import { RoutineDto, CreateRoutineDto, UpdateRoutineDto, RoutineQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { RoutinesService } from '../services/routines.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiFile } from '../decorators/swagger.schema';

@ApiTags('ROUTINE')
@Controller()
export class RoutinesController {
  constructor(private readonly service: RoutinesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  @ApiFile({ name: 'files', isArray: true }, { isRequired: false })
  async createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const routine = await this.service.create(createRoutineDto, files);

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

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async removeRoutines(@Body() routineIds: string[]) {
    const routines = await this.service.removeManyByIds(routineIds);
    return new ResponseEntity(HttpStatus.OK, '성공', routines.count);
  }

  @Patch(':routineId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async updateRoutine(
    @Param('routineId') routineId: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    const routine = await this.service.update({
      where: { id: routineId },
      data: updateRoutineDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoutineDto, routine));
  }

  @Patch(':routineId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoutineDto, HttpStatus.OK)
  async removeRoutine(@Param('routineId') routineId: string) {
    const routine = await this.service.remove(routineId);
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
  async getRoutinesByQuery(@Query() query: RoutineQueryDto) {
    const { count, routines } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      routines.map((routine) => routine.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
