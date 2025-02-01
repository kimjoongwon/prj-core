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
  ParseFilePipe,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { DepotDto, CreateDepotDto, UpdateDepotDto, DepotQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { DepotsService } from '../services/depots.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiFile } from '../decorators/swagger.schema';
import _ from 'lodash';

@ApiTags('DEPOTS')
@Controller()
export class DepotsController {
  constructor(private readonly service: DepotsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  @ApiFile(
    { name: 'files', isArray: true },
    {
      isRequired: false,
    },
  )
  async createDepot(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const depot = await this.service.create(files);
    return new ResponseEntity(HttpStatus.OK, '성공', depot.toDto());
  }

  @Get(':depotId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async getDepotById(@Param('depotId') depotId: string) {
    const depot = await this.service.getById(depotId);
    return new ResponseEntity(HttpStatus.OK, '성공', depot.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async removeDepots(@Body() depotIds: string[]) {
    const depots = await this.service.removeManyByIds(depotIds);
    return new ResponseEntity(HttpStatus.OK, '성공', depots.count);
  }

  @Patch(':depotId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async updateDepot(@Param('depotId') depotId: string, @Body() updateDepotDto: UpdateDepotDto) {
    const depot = await this.service.updateById(depotId, updateDepotDto);

    // 추가 로직 필요
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(DepotDto, depot));
  }

  @Patch(':depotId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async removeDepot(@Param('depotId') depotId: string) {
    const depot = await this.service.remove(depotId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(DepotDto, depot));
  }

  @Delete(':depotId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async deleteDepot(@Param('depotId') depotId: string) {
    const depot = await this.service.deleteById(depotId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(DepotDto, depot));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK, { isArray: true })
  async getDepotsByQuery(@Query() query: DepotQueryDto) {
    const { count, depots } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      depots.map((depot) => depot.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
