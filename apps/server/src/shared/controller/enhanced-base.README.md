/**
 * Enhanced BaseController 사용 가이드
 * 
 * 이 컨트롤러는 orval로 API를 생성할 때 함수명 중복 문제를 해결하기 위해 만들어졌습니다.
 * 각 엔티티별로 고유한 함수명을 가지도록 설계되었습니다.
 */

/**
 * 사용 예시:
 * 
 * ```typescript
 * import { Controller, Type, Body, Param, Query, Post, Get, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
 * import { ApiTags, ApiOperation } from '@nestjs/swagger';
 * import { EnhancedBaseController } from './enhanced-base.controller';
 * import { CreateYourEntityDto, UpdateYourEntityDto, QueryYourEntityDto, YourEntityDto } from '../dto';
 * import { YourEntitiesService } from '../service';
 * import { Auth, ApiResponseEntity } from '../decorator';
 * import { ResponseEntity } from '../entity';
 * 
 * @ApiTags('YOUR-ENTITIES')
 * @Controller()
 * export class YourEntitiesController extends EnhancedBaseController<
 *   YourEntityDto,
 *   CreateYourEntityDto,
 *   UpdateYourEntityDto,
 *   QueryYourEntityDto,
 *   YourEntitiesService
 * > {
 *   protected readonly service: YourEntitiesService;
 *   protected readonly dtoClass: Type<YourEntityDto> = YourEntityDto;
 *   protected readonly entityName: string = 'YourEntity';
 * 
 *   constructor(service: YourEntitiesService) {
 *     super();
 *     this.service = service;
 *   }
 * 
 *   @Post()
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'createYourEntity', summary: 'Create your entity' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK)
 *   async createYourEntity(@Body() createDto: CreateYourEntityDto): Promise<ResponseEntity<YourEntityDto>> {
 *     return this.createEntity(createDto);
 *   }
 * 
 *   @Get(':id')
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'getYourEntityById', summary: 'Get your entity by ID' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK)
 *   async getYourEntityById(@Param('id') id: string): Promise<ResponseEntity<YourEntityDto>> {
 *     return this.getEntityById(id);
 *   }
 * 
 *   @Patch(':id')
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'updateYourEntityById', summary: 'Update your entity by ID' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK)
 *   async updateYourEntityById(
 *     @Param('id') id: string,
 *     @Body() updateDto: UpdateYourEntityDto,
 *   ): Promise<ResponseEntity<YourEntityDto>> {
 *     return this.updateEntityById(id, updateDto);
 *   }
 * 
 *   @Patch(':id/removedAt')
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'removeYourEntityById', summary: 'Soft delete your entity by ID' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK)
 *   async removeYourEntityById(@Param('id') id: string): Promise<ResponseEntity<YourEntityDto>> {
 *     return this.removeEntityById(id);
 *   }
 * 
 *   @Delete(':id')
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'deleteYourEntityById', summary: 'Hard delete your entity by ID' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK)
 *   async deleteYourEntityById(@Param('id') id: string): Promise<ResponseEntity<YourEntityDto>> {
 *     return this.deleteEntityById(id);
 *   }
 * 
 *   @Get()
 *   @Auth([])
 *   @HttpCode(HttpStatus.OK)
 *   @ApiOperation({ operationId: 'getManyYourEntitiesByQuery', summary: 'Get your entities by query' })
 *   @ApiResponseEntity(YourEntityDto, HttpStatus.OK, { isArray: true })
 *   async getManyYourEntitiesByQuery(@Query() query: QueryYourEntityDto): Promise<ResponseEntity<YourEntityDto[]>> {
 *     return this.getManyEntitiesByQuery(query);
 *   }
 * }
 * ```
 */

/**
 * 장점:
 * 1. orval 생성 시 고유한 함수명 (createWorkspace, getWorkspaceById 등)
 * 2. 명확한 API 문서화 (operationId 명시)
 * 3. 타입 안전성 유지
 * 4. 코드 재사용성
 * 5. 일관된 패턴
 */

/**
 * 기존 BaseController와의 차이점:
 * - 기존: create, getById, updateById (동일한 함수명)
 * - 개선: createWorkspace, getWorkspaceById, updateWorkspaceById (엔티티별 고유 함수명)
 */
