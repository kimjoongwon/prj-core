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
import { CreateProgramDto, ProgramDto, UpdateProgramDto, ProgramQueryDto } from '../programs/dtos';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { ProgramsService } from './programs.service';

@ApiTags('ADMIN_PROGRAMS')
@Controller(ApiEndpoints.ADMIN_TEMPLATES)
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createProgram(@Body() createProgramDto: CreateProgramDto) {
    const program = await this.service.create({
      data: createProgramDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Get(':programId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async getProgram(@Param('programId') programId: string) {
    const program = await this.service.getUnique({ where: { id: programId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ProgramDto, program));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ProgramDto, HttpStatus.OK)
  async removePrograms(@Body() programIds: string[]) {
    const programs = await this.service.updateMany({
      where: { id: { in: programIds } },
      data: { removedAt: new Date() },
    });

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
    const program = await this.service.delete(programId);
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
      programs.map((program) => plainToInstance(ProgramDto, program)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
