import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  Type,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth } from '../decorator';
import { ResponseEntity, PageMetaDto } from '@shared/schema';

/**
 * 자동으로 고유한 함수명을 생성하는 오토 베이스 컨트롤러
 * 단순히 상속만 하면 자동으로 엔티티명이 포함된 함수명이 생성됩니다.
 *
 * getManyByQuery 메서드에서 Swagger에 Query 파라미터를 표시하려면 개별 컨트롤러에서 메서드를 오버라이드하고 @ApiQueryDto를 추가하세요:
 *
 * @example
 * ```typescript
 * @CrudController({
 *   entityName: 'YourEntity',
 *   tag: 'YOUR-ENTITIES',
 * })
 * @Controller()
 * export class YourController extends AutoBaseController<...> {
 *   protected readonly service: YourEntitiesService;
 *   protected readonly dtoClass: Type<YourEntityDto> = YourEntityDto;
 *   protected readonly queryDtoClass: Type<QueryYourEntityDto> = QueryYourEntityDto;
 *   protected readonly entityName: string = 'YourEntity';
 *
 *   constructor(service: YourEntitiesService) {
 *     super();
 *     this.service = service;
 *   }
 *
 *   // Swagger에 Query 파라미터를 표시하려면 메서드를 오버라이드하세요
 *   @Get()
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ summary: '엔티티 목록 조회' })
 *   @ApiResponse({ status: 200, description: '성공' })
 *   @ApiQueryDto(QueryYourEntityDto)
 *   async getManyByQuery(@Req() req, @Res() res): Promise<ResponseEntity<YourEntityDto[]>> {
 *     return super.getManyByQuery(req, res);
 *   }
 * }
 * ```
 *
 * 위와 같이 설정하면 getManyByQuery 메서드의 Query 파라미터가 자동으로 Swagger에 표시됩니다.
 * QueryYourEntityDto에 정의된 모든 @ApiProperty 속성들이 자동으로 @ApiQuery로 변환됩니다.
 */
@Injectable()
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
  protected abstract readonly queryDtoClass: Type<TQueryDto>;
  protected abstract readonly entityName: string;

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '새로운 엔티티 생성' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiBody({ description: '생성할 데이터' })
  async create(@Body() createDto: TCreateDto): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.create(createDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 엔티티 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: '엔티티 ID', type: 'string' })
  async getById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.getById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Patch(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 엔티티 수정' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: '엔티티 ID', type: 'string' })
  @ApiBody({ description: '수정할 데이터' })
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
  @ApiOperation({ summary: 'ID로 엔티티 삭제 (soft delete)' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: '엔티티 ID', type: 'string' })
  async removeById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.removeById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID로 엔티티 완전 삭제 (hard delete)' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiParam({ name: 'id', description: '엔티티 ID', type: 'string' })
  async deleteById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.deleteById(id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(this.dtoClass, entity));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: '성공' })
  async getManyByQuery(@Query() query: TQueryDto): Promise<ResponseEntity<TDto[]>> {
    // Query 객체를 적절한 DTO 인스턴스로 변환
    const queryInstance = plainToInstance(this.queryDtoClass, query);
    const { items, count } = await this.service.getManyByQuery(queryInstance);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, items),
      queryInstance.toPageMetaDto(count),
    );
  }
}
