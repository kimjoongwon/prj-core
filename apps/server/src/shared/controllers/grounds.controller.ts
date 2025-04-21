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
import { Auth, ApiResponseEntity } from '../decorators';
import { GroundDto, CreateGroundDto, GroundQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { GroundsService } from '../services/grounds.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('GROUNDS')
@Controller()
export class GroundsController {
  constructor(private readonly service: GroundsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async createGround(@Body() createGroundDto: CreateGroundDto) {
    const ground = await this.service.create(createGroundDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Get(':groundId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async getGround(@Param('groundId') groundId: string) {
    const ground = await this.service.getById(groundId);
    return new ResponseEntity(HttpStatus.OK, '성공', ground.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async removeGrounds(@Body() groundIds: string[]) {
    const grounds = await this.service.removeManyByIds(groundIds);
    return new ResponseEntity(HttpStatus.OK, '성공', grounds.count);
  }

  @Patch(':groundId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async removeGroundById(@Param('groundId') groundId: string) {
    const ground = await this.service.removeById(groundId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Delete(':groundId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async deleteGround(@Param('groundId') groundId: string) {
    const ground = await this.service.deleteById(groundId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
  async getGroundsByQuery(@Query() query: GroundQueryDto) {
    const { count, grounds } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      grounds.map((ground) => ground.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}