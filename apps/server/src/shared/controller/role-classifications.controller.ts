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
} from "@nestjs/common";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import {
	type CreateRoleClassificationDto,
	QueryRoleClassificationDto,
	ResponseEntity,
	RoleClassificationDto,
	type UpdateRoleClassificationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { Auth } from "../decorator";
import { RoleClassificationsService } from "../service/role-classifications.service";

@ApiTags("ROLE_CLASSIFICATIONS")
@Controller()
export class RoleClassificationsController {
	constructor(private readonly service: RoleClassificationsService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "createRoleClassification",
		summary: "역할 분류 생성",
	})
	@ApiResponse({ status: 200, description: "성공" })
	@ApiBody({ description: "생성할 역할 분류 데이터" })
	async create(
		@Body() createDto: CreateRoleClassificationDto,
	): Promise<ResponseEntity<RoleClassificationDto>> {
		const entity = await this.service.create(createDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, entity),
		);
	}

	@Get(":id")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getRoleClassificationById",
		summary: "ID로 역할 분류 조회",
	})
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "id", description: "역할 분류 ID", type: "string" })
	async getById(
		@Param("id") id: string,
	): Promise<ResponseEntity<RoleClassificationDto>> {
		const entity = await this.service.getById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, entity),
		);
	}

	@Patch(":id")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateRoleClassificationById",
		summary: "ID로 역할 분류 수정",
	})
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "id", description: "역할 분류 ID", type: "string" })
	@ApiBody({ description: "수정할 역할 분류 데이터" })
	async updateById(
		@Param("id") id: string,
		@Body() updateDto: UpdateRoleClassificationDto,
	): Promise<ResponseEntity<RoleClassificationDto>> {
		const entity = await this.service.updateById(id, updateDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, entity),
		);
	}

	@Patch(":id/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "removeRoleClassificationById",
		summary: "ID로 역할 분류 삭제 (소프트 삭제)",
	})
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "id", description: "역할 분류 ID", type: "string" })
	async removeById(
		@Param("id") id: string,
	): Promise<ResponseEntity<RoleClassificationDto>> {
		const entity = await this.service.removeById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, entity),
		);
	}

	@Delete(":id")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "deleteRoleClassificationById",
		summary: "ID로 역할 분류 완전 삭제",
	})
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "id", description: "역할 분류 ID", type: "string" })
	async deleteById(
		@Param("id") id: string,
	): Promise<ResponseEntity<RoleClassificationDto>> {
		const entity = await this.service.deleteById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, entity),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getRoleClassificationsByQuery",
		summary: "쿼리 조건으로 역할 분류 목록 조회",
	})
	@ApiResponse({ status: 200, description: "성공" })
	async getManyByQuery(
		@Query() query: QueryRoleClassificationDto,
	): Promise<ResponseEntity<RoleClassificationDto[]>> {
		const queryInstance = plainToInstance(QueryRoleClassificationDto, query);
		const { items, count } = await this.service.getManyByQuery(queryInstance);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoleClassificationDto, items),
			queryInstance.toPageMetaDto(count),
		);
	}
}
