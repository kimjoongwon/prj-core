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
import { DepotDto, UpdateDepotDto, DepotQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { DepotsService } from '../services/depots.service';
import { ApiTags } from '@nestjs/swagger';
import _ from 'lodash';
import { ApiFile } from '../decorators/swagger.schema';

@ApiTags('DEPOTS')
@Controller()
export class DepotsController {
  constructor(private readonly service: DepotsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseEntity(DepotDto, HttpStatus.CREATED)
  @ApiFile(
    [
      {
        name: 'thumbnails',
        isArray: true,
      },
      {
        name: 'videos',
        isArray: true,
      },
      {
        name: 'images',
        isArray: true,
      },
    ],
    {
      isRequired: false,
    },
  )
  async createDepot(
    @UploadedFiles()
    {
      thumbnails,
      videos,
      images,
    }: {
      thumbnails: Express.Multer.File[];
      videos: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ) {
    const depot = await this.service.create(thumbnails, videos, images);
    return new ResponseEntity(HttpStatus.CREATED, 'success', depot.toDto());
  }

  @Get(':depotId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async getDepotById(@Param('depotId') depotId: string) {
    const depot = await this.service.getById(depotId);
    return new ResponseEntity(HttpStatus.OK, '성공', depot.toDto());
  }

  @Patch(':depotId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(DepotDto, HttpStatus.OK)
  async updateDepot(@Param('depotId') depotId: string, updateDepotDto: UpdateDepotDto) {
    const depot = await this.service.updateById(depotId, updateDepotDto);
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
