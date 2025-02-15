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
import { DepotDto, UpdateDepotDto, DepotQueryDto, CreateDepotDto } from '../dtos';
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
        name: 'vidoes',
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
    @Body() createDepotDto: CreateDepotDto,
    @UploadedFiles()
    {
      thumbnails,
      vidoes,
      images,
    }: {
      thumbnails: Express.Multer.File[];
      vidoes: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ) {
    // const depot = await this.service.create(createDepotDto);
    // return new ResponseEntity(HttpStatus.CREATED, 'success', depot.toDto());
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
