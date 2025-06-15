import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateGroundDto, UpdateGroundDto, GroundDto, QueryGroundDto } from '../dto';
import { GroundsService } from '../service/grounds.service';
import { Auth, ApiResponseEntity } from '../decorator';
import { ResponseEntity } from '../entity';

@ApiTags('GROUNDS')
@Controller()
export class GroundsController {
  constructor(private readonly groundsService: GroundsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '새로운 Ground 생성' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiBody({ type: CreateGroundDto, description: '생성할 Ground 데이터' })
  async createGround(@Body() createGroundDto: CreateGroundDto): Promise<ResponseEntity<GroundDto>> {
    const ground = await this.groundsService.create(createGroundDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 Ground 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: 'Ground ID', type: 'string' })
  async getGroundById(@Param('id') id: string): Promise<ResponseEntity<GroundDto>> {
    const ground = await this.groundsService.getById(id);
    if (!ground) {
      return new ResponseEntity(HttpStatus.NOT_FOUND, 'Ground를 찾을 수 없습니다.');
    }
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Patch(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 Ground 수정' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: 'Ground ID', type: 'string' })
  @ApiBody({ type: UpdateGroundDto, description: '수정할 Ground 데이터' })
  async updateGroundById(
    @Param('id') id: string,
    @Body() updateGroundDto: UpdateGroundDto,
  ): Promise<ResponseEntity<GroundDto>> {
    const ground = await this.groundsService.updateById(id, updateGroundDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Patch(':id/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 Ground 삭제 (soft delete)' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: 'Ground ID', type: 'string' })
  async removeGroundById(@Param('id') id: string): Promise<ResponseEntity<GroundDto>> {
    const ground = await this.groundsService.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 Ground 완전 삭제 (hard delete)' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: 'Ground ID', type: 'string' })
  async deleteGroundById(@Param('id') id: string): Promise<ResponseEntity<GroundDto>> {
    const ground = await this.groundsService.deleteById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GroundDto, ground));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ground 목록 조회' })
  @ApiResponseEntity(GroundDto, HttpStatus.OK)
  async getGroundsByQuery(@Query() query: QueryGroundDto): Promise<ResponseEntity<GroundDto[]>> {
    const { grounds, count } = await this.groundsService.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(GroundDto, grounds),
      query.toPageMetaDto(count),
    );
  }
}
