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
import { ProgramDto, CreateProgramDto, UpdateProgramDto, ProgramQueryDto } from '../dto';
import { PageMetaDto } from '../dto/query/page-meta.dto';
import { ResponseEntity } from '../entity/response.entity';
import { ProgramsService } from '../service/programs.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PROGRAM')
@Controller()
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async createProgram(@Body() createProgramDto: CreateProgramDto) {
    const program = await this.service.create(createProgramDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Get(':programId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async getProgram(@Param('programId') programId: string) {
    const program = await this.service.getById(programId);
    return new ResponseEntity(HttpStatus.OK, '성공', program.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async removePrograms(@Body() programIds: string[]) {
    const programs = await this.service.removeManyByIds(programIds);
    return new ResponseEntity(HttpStatus.OK, '성공', programs.count);
  }

  @Patch(':programId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async updateProgram(
    @Param('programId') programId: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    const program = await this.service.update({
      where: { id: programId },
      data: updateProgramDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Patch(':programId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async removeProgram(@Param('programId') programId: string) {
    const program = await this.service.remove(programId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Delete(':programId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async deleteProgram(@Param('programId') programId: string) {
    const program = await this.service.deleteById(programId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK, { isArray: true })
  async getProgramsByQuery(@Query() query: ProgramQueryDto) {
    const { count, programs } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      programs.map((program) => program.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
