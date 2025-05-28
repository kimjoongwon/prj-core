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
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { ResponseEntity } from '../entity';
import { PageMetaDto } from '../dto/query/page-meta.dto';

export interface SmartControllerOptions {
  /** API 태그 이름 */
  tag?: string;
  /** 기본 인증 역할 */
  defaultRoles?: any[];
  /** 활성화할 엔드포인트들 */
  enabledEndpoints?: {
    create?: boolean;
    getById?: boolean;
    updateById?: boolean;
    removeById?: boolean;
    deleteById?: boolean;
    getManyByQuery?: boolean;
  };
  /** 엔티티 이름 (OpenAPI 문서화용) */
  entityName?: string;
}

/**
 * 클래스 데코레이터: 자동으로 CRUD 메서드에 OpenAPI 데코레이터를 적용
 */
export function SmartCrudController<T extends Type<any>>(
  responseDto: Type<any>,
  options: SmartControllerOptions & {
    createDto?: Type<any>;
    updateDto?: Type<any>;
  } = {},
) {
  return function <TFunction extends T>(target: TFunction): TFunction {
    // API Tags 적용
    if (options.tag) {
      ApiTags(options.tag)(target);
    }

    // 프로토타입 체인을 통해 메서드 찾기 함수
    const findMethodDescriptor = (methodName: string) => {
      let current = target.prototype;
      while (current) {
        const descriptor = Object.getOwnPropertyDescriptor(current, methodName);
        if (descriptor) return descriptor;
        current = Object.getPrototypeOf(current);
      }
      return null;
    };

    // Create 메서드에 ApiBody 적용
    const createDescriptor = findMethodDescriptor('create');
    if (createDescriptor) {
      ApiOperation({ 
        summary: `Create ${options.entityName || responseDto.name}`,
        description: `Create a new ${(options.entityName || responseDto.name).toLowerCase()}`
      })(target.prototype, 'create', createDescriptor);
      
      // @Body 파라미터의 타입을 추론하여 ApiBody 적용
      if (options.createDto) {
        ApiBody({ type: options.createDto })(target.prototype, 'create', createDescriptor);
      }
      
      ApiResponseEntity(responseDto, HttpStatus.OK)(target.prototype, 'create', createDescriptor);
    }

    // UpdateById 메서드에 ApiBody 적용  
    const updateByIdDescriptor = findMethodDescriptor('updateById');
    if (updateByIdDescriptor) {
      ApiOperation({ 
        summary: `Update ${options.entityName || responseDto.name} by ID`,
        description: `Update a ${(options.entityName || responseDto.name).toLowerCase()} by its ID`
      })(target.prototype, 'updateById', updateByIdDescriptor);
      
      ApiParam({ name: 'id', description: 'Unique identifier' })(target.prototype, 'updateById', updateByIdDescriptor);
      
      // @Body 파라미터의 타입을 추론하여 ApiBody 적용
      if (options.updateDto) {
        ApiBody({ type: options.updateDto })(target.prototype, 'updateById', updateByIdDescriptor);
      }
      
      ApiResponseEntity(responseDto, HttpStatus.OK)(target.prototype, 'updateById', updateByIdDescriptor);
    }

    // GetById 메서드 추가
    const getByIdDescriptor = findMethodDescriptor('getById');
    if (getByIdDescriptor) {
      ApiOperation({ 
        summary: `Get ${options.entityName || responseDto.name} by ID`,
        description: `Retrieve a ${(options.entityName || responseDto.name).toLowerCase()} by its ID`
      })(target.prototype, 'getById', getByIdDescriptor);
      ApiParam({ name: 'id', description: 'Unique identifier' })(target.prototype, 'getById', getByIdDescriptor);
      ApiResponseEntity(responseDto, HttpStatus.OK)(target.prototype, 'getById', getByIdDescriptor);
    }

    // RemoveById 메서드 추가
    const removeByIdDescriptor = findMethodDescriptor('removeById');
    if (removeByIdDescriptor) {
      ApiOperation({ 
        summary: `Remove ${options.entityName || responseDto.name} by ID`,
        description: `Soft delete a ${(options.entityName || responseDto.name).toLowerCase()} by its ID`
      })(target.prototype, 'removeById', removeByIdDescriptor);
      ApiParam({ name: 'id', description: 'Unique identifier' })(target.prototype, 'removeById', removeByIdDescriptor);
      ApiResponseEntity(responseDto, HttpStatus.OK)(target.prototype, 'removeById', removeByIdDescriptor);
    }

    // DeleteById 메서드 추가
    const deleteByIdDescriptor = findMethodDescriptor('deleteById');
    if (deleteByIdDescriptor) {
      ApiOperation({ 
        summary: `Delete ${options.entityName || responseDto.name} by ID`,
        description: `Permanently delete a ${(options.entityName || responseDto.name).toLowerCase()} by its ID`
      })(target.prototype, 'deleteById', deleteByIdDescriptor);
      ApiParam({ name: 'id', description: 'Unique identifier' })(target.prototype, 'deleteById', deleteByIdDescriptor);
      ApiResponseEntity(responseDto, HttpStatus.OK)(target.prototype, 'deleteById', deleteByIdDescriptor);
    }

    // GetManyByQuery 메서드 추가
    const getManyByQueryDescriptor = findMethodDescriptor('getManyByQuery');
    if (getManyByQueryDescriptor) {
      ApiOperation({ 
        summary: `Get multiple ${options.entityName || responseDto.name}s`,
        description: `Retrieve multiple ${(options.entityName || responseDto.name).toLowerCase()}s with query parameters`
      })(target.prototype, 'getManyByQuery', getManyByQueryDescriptor);
      
      // Query 파라미터들에 대한 ApiQuery 적용
      ApiQuery({ 
        name: 'skip', 
        required: false, 
        type: Number, 
        description: 'Number of records to skip for pagination',
        example: 0
      })(target.prototype, 'getManyByQuery', getManyByQueryDescriptor);
      
      ApiQuery({ 
        name: 'take', 
        required: false, 
        type: Number, 
        description: 'Number of records to take for pagination',
        example: 10
      })(target.prototype, 'getManyByQuery', getManyByQueryDescriptor);
      
      ApiResponseEntity(responseDto, HttpStatus.OK, { isArray: true })(target.prototype, 'getManyByQuery', getManyByQueryDescriptor);
    }

    return target;
  };
}

/**
 * 스마트 베이스 컨트롤러 - 데코레이터 자동 적용
 */
export abstract class SmartBaseController<
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
  protected readonly options: SmartControllerOptions = {};

  constructor(options?: SmartControllerOptions) {
    this.options = {
      defaultRoles: [],
      enabledEndpoints: {
        create: true,
        getById: true,
        updateById: true,
        removeById: true,
        deleteById: true,
        getManyByQuery: true,
      },
      ...options,
    };
  }

  protected getSuccessResponse(data?: any, meta?: PageMetaDto): ResponseEntity<any> {
    return new ResponseEntity(HttpStatus.OK, '성공', data, meta);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  async create(@Body() createDto: TCreateDto): Promise<ResponseEntity<TDto>> {
    if (!this.options.enabledEndpoints?.create) {
      throw new Error('Create endpoint is disabled');
    }

    const entity = await this.service.create(createDto);
    return this.getSuccessResponse(plainToInstance(this.dtoClass, entity));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    if (!this.options.enabledEndpoints?.getById) {
      throw new Error('GetById endpoint is disabled');
    }

    const entity = await this.service.getById(id);
    return this.getSuccessResponse(plainToInstance(this.dtoClass, entity));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: TUpdateDto,
  ): Promise<ResponseEntity<TDto>> {
    if (!this.options.enabledEndpoints?.updateById) {
      throw new Error('UpdateById endpoint is disabled');
    }

    const entity = await this.service.updateById(id, updateDto);
    return this.getSuccessResponse(plainToInstance(this.dtoClass, entity));
  }

  @Patch(':id/removedAt')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  async removeById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    if (!this.options.enabledEndpoints?.removeById) {
      throw new Error('RemoveById endpoint is disabled');
    }

    const entity = await this.service.removeById(id);
    return this.getSuccessResponse(plainToInstance(this.dtoClass, entity));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  async deleteById(@Param('id') id: string): Promise<ResponseEntity<TDto>> {
    if (!this.options.enabledEndpoints?.deleteById) {
      throw new Error('DeleteById endpoint is disabled');
    }

    const entity = await this.service.deleteById(id);
    return this.getSuccessResponse(plainToInstance(this.dtoClass, entity));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([])
  async getManyByQuery(@Query() query: TQueryDto): Promise<ResponseEntity<TDto[]>> {
    if (!this.options.enabledEndpoints?.getManyByQuery) {
      throw new Error('GetManyByQuery endpoint is disabled');
    }

    const { items, count } = await this.service.getManyByQuery(query);
    return this.getSuccessResponse(
      plainToInstance(this.dtoClass, items),
      query.toPageMetaDto(count),
    );
  }

  /**
   * 커스텀 성공 메시지
   */
  protected createSuccessResponse(
    message: string,
    data?: any,
    meta?: PageMetaDto,
  ): ResponseEntity<any> {
    return new ResponseEntity(HttpStatus.OK, message, data, meta);
  }

  /**
   * 커스텀 에러 응답
   */
  protected createErrorResponse(
    status: HttpStatus,
    message: string,
    data?: any,
  ): ResponseEntity<any> {
    return new ResponseEntity(status, message, data);
  }
}
