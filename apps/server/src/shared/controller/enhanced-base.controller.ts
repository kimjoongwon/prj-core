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
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { ResponseEntity } from '../entity';
import { PageMetaDto } from '../dto/query/page-meta.dto';

/**
 * 개선된 CRUD 작업을 위한 추상 베이스 컨트롤러
 * 각 컨트롤러에서 메서드를 오버라이드하여 고유한 함수명을 가지도록 합니다.
 */
export abstract class EnhancedBaseController<
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
  protected abstract readonly entityName: string;

  /**
   * 엔티티 생성 - 하위 클래스에서 오버라이드 필요
   */
  protected async createEntity(createDto: TCreateDto): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.create(createDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  /**
   * ID로 엔티티 조회 - 하위 클래스에서 오버라이드 필요
   */
  protected async getEntityById(id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.getById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  /**
   * ID로 엔티티 수정 - 하위 클래스에서 오버라이드 필요
   */
  protected async updateEntityById(
    id: string,
    updateDto: TUpdateDto,
  ): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.updateById(id, updateDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  /**
   * ID로 엔티티 소프트 삭제 - 하위 클래스에서 오버라이드 필요
   */
  protected async removeEntityById(id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.removeById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  /**
   * ID로 엔티티 물리적 삭제 - 하위 클래스에서 오버라이드 필요
   */
  protected async deleteEntityById(id: string): Promise<ResponseEntity<TDto>> {
    const entity = await this.service.deleteById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, entity),
    );
  }

  /**
   * 쿼리로 엔티티 목록 조회 - 하위 클래스에서 오버라이드 필요
   */
  protected async getManyEntitiesByQuery(query: TQueryDto): Promise<ResponseEntity<TDto[]>> {
    const { items, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(this.dtoClass, items),
      query.toPageMetaDto(count),
    );
  }
}
