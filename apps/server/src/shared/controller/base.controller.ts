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
  Type
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { ResponseEntity } from '../entity';
import { PageMetaDto } from '../dto/query/page-meta.dto';

/**
 * 기본 CRUD 작업을 위한 추상 베이스 컨트롤러
 * OpenAPI 문서화가 자동으로 적용됩니다.
 */
export abstract class BaseController<
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
  }
> {
  protected abstract readonly service: TService;
  protected abstract readonly dtoClass: Type<TDto>;

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async create(@Body() createDto: TCreateDto): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.create(createDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.getById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  @Patch(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: TUpdateDto,
  ): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.updateById(id, updateDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  @Patch(':id/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async removeById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.removeById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.deleteById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
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
