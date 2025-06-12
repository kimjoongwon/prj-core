import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Type,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { ResponseEntity } from '../entity';
import { PageMetaDto } from '../dto/query/page-meta.dto';

/**
 * 자동으로 고유한 함수명을 생성하는 오토 베이스 컨트롤러
 * 단순히 상속만 하면 자동으로 엔티티명이 포함된 함수명이 생성됩니다.
 */
export abstract class AutoBaseController<
  TDto,
  TCreateDto,
  TUpdateDto,
  TQueryDto extends { toPageMetaDto(count: number): PageMetaDto },
  TService extends {
    create(dto: TCreateDto): Promise<any>;
    getById(id: string): Promise<any>;
    updateById(id: string, dto: TUpdateDto): Promise<any>;
    removeById(id: string): Promise<any>;
    deleteById(id: string): Promise<any>;
    getManyByQuery(query: TQueryDto): Promise<{ items: any[]; count: number }>;
  },
> {
  protected abstract readonly service: TService;
  protected abstract readonly dtoClass: Type<TDto>;
  protected abstract readonly entityName: string;

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async create(@Body() createDto: TCreateDto): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.create(createDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.getById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Patch(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: TUpdateDto,
  ): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.updateById(id, updateDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Patch(':id/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async removeById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.deleteById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getManyByQuery(@Query() query: TQueryDto): Promise<ResponseEntity<TDto[]>> {
    const { items, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, items),
      query.toPageMetaDto(count),
    );
  }
}
