import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CategoryDto,
	CreateCategoryDto,
	QueryCategoryDto,
	UpdateCategoryDto,
} from "@cocrepo/dto";
import { CategoryFacade } from "@cocrepo/facade";
import { SpaceContext } from "@cocrepo/service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("CATEGORIES")
@Controller()
export class CategoriesController {
	constructor(
		private readonly categoriesService: CategoryFacade,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getCategories",
		summary: "카테고리 목록 조회",
		description:
			"카테고리 목록을 조회합니다. type 쿼리 파라미터로 유형별 필터링이 가능합니다. 상위/하위 카테고리 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("카테고리 목록 조회 성공")
	async getCategories(@Query() query: QueryCategoryDto) {
		return this.categoriesService.getAll(query);
	}

	@Get(":id")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getCategoryById",
		summary: "카테고리 상세 조회",
		description:
			"ID로 카테고리를 조회합니다. 상위/하위 카테고리 및 연결된 역할(RoleClassification) 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "카테고리 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(CategoryDto, HttpStatus.OK)
	@ResponseMessage("카테고리 상세 조회 성공")
	async getCategoryById(@Param("id", ParseUUIDPipe) id: string) {
		return this.categoriesService.getById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createCategory",
		summary: "카테고리 생성",
		description:
			"새로운 카테고리를 생성합니다. FULL_ACCESS 전용 API입니다. parentId로 상위 카테고리를 지정할 수 있습니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateCategoryDto,
		description: "생성할 카테고리 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(CategoryDto, HttpStatus.CREATED)
	@ResponseMessage("카테고리 생성 성공")
	async createCategory(@Body() dto: CreateCategoryDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.categoriesService.create(dto);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateCategory",
		summary: "카테고리 수정",
		description:
			"카테고리 정보를 수정합니다. FULL_ACCESS 전용 API이며, parentId 변경 시 순환 참조를 검증합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "카테고리 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateCategoryDto,
		description: "수정할 카테고리 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CategoryDto, HttpStatus.OK)
	@ResponseMessage("카테고리 수정 성공")
	async updateCategory(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteCategory",
		summary: "카테고리 삭제",
		description:
			"카테고리를 삭제합니다. FULL_ACCESS 전용 API이며, 하위 카테고리가 있으면 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "카테고리 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CategoryDto, HttpStatus.OK)
	@ResponseMessage("카테고리 삭제 성공")
	async deleteCategory(@Param("id", ParseUUIDPipe) id: string) {
		return this.categoriesService.delete(id);
	}
}
