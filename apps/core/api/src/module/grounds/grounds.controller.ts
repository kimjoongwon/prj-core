import { RolesGuard } from "@cocrepo/be-common";
import { CONTEXT_KEYS, SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { CreateGroundDto, GroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground } from "@cocrepo/entity";
import { GroundsService } from "@cocrepo/service";
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
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

@ApiTags("GROUNDS")
@Controller()
export class GroundsController {
	constructor(
		private readonly groundsService: GroundsService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 전체 Ground 목록 조회 (공개)
	 * GET /api/v1/grounds
	 */
	@Public()
	@Get()
	@ApiOperation({
		operationId: "getGrounds",
		summary: "Ground 목록 조회",
		description: "모든 Ground 목록을 조회합니다.",
	})
	@ApiErrors(500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.ground.list.success")
	async getGrounds(): Promise<Ground[]> {
		return this.groundsService.getAll();
	}

	/**
	 * 내 Space의 Ground 목록 조회
	 * GET /api/v1/grounds/my
	 *
	 * 참고: /my는 /:groundId 보다 먼저 정의되어야 라우팅 우선순위가 올바르게 동작합니다.
	 */
	@Get("my")
	@ApiOperation({
		operationId: "getMyGrounds",
		summary: "내 Space의 Ground 목록 조회",
		description:
			"X-Space-ID 헤더로 지정한 Space의 Ground를 조회합니다. FULL_ACCESS는 헤더 없이 모든 Ground 조회 가능.",
	})
	@ApiAuth()
	@ApiErrors(500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.ground.mySpace.success")
	async getMyGrounds(): Promise<Ground[]> {
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);
		return this.groundsService.getMyGrounds(spaceId);
	}

	/**
	 * Ground 단건 조회
	 * GET /api/v1/grounds/:groundId
	 */
	@Get(":groundId")
	@ApiOperation({
		operationId: "getGround",
		summary: "Ground 단건 조회",
		description: "ID로 특정 Ground를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "groundId",
		description: "Ground ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK)
	@ResponseMessage("common.ground.get.success")
	async getGround(
		@Param("groundId", ParseUUIDPipe) groundId: string,
	): Promise<Ground> {
		return this.groundsService.getById(groundId);
	}

	/**
	 * Ground 등록 (Space 자동 생성)
	 * POST /api/v1/grounds
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createGround",
		summary: "Ground 등록",
		description:
			"새로운 시설을 등록합니다. 등록 시 서버에서 Space를 자동 생성합니다. FULL_ACCESS 전용 API입니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateGroundDto,
		description: "등록할 시설 정보",
	})
	@ApiErrors(401, 403, 409, 500)
	@ApiResponseEntity(GroundDto, HttpStatus.CREATED)
	@ResponseMessage("common.ground.create.success")
	async createGround(@Body() dto: CreateGroundDto): Promise<Ground> {
		return this.groundsService.createGround(dto);
	}

	/**
	 * Ground 정보 수정 (businessNo 변경 불가)
	 * PATCH /api/v1/grounds/:groundId
	 */
	@Patch(":groundId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateGround",
		summary: "Ground 정보 수정",
		description:
			"시설 정보를 수정합니다. 사업자등록번호(businessNo)는 변경할 수 없습니다. FULL_ACCESS 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "groundId",
		description: "Ground ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateGroundDto,
		description: "수정할 시설 정보 (businessNo 제외)",
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK)
	@ResponseMessage("common.ground.update.success")
	async updateGround(
		@Param("groundId", ParseUUIDPipe) groundId: string,
		@Body() dto: UpdateGroundDto,
	): Promise<Ground> {
		return this.groundsService.updateGround(groundId, dto);
	}

	/**
	 * Ground 소프트 삭제
	 * DELETE /api/v1/grounds/:groundId
	 */
	@Delete(":groundId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "removeGround",
		summary: "Ground 삭제",
		description: "시설을 삭제합니다. (소프트 삭제) FULL_ACCESS 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "groundId",
		description: "Ground ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("common.ground.delete.success")
	async removeGround(
		@Param("groundId", ParseUUIDPipe) groundId: string,
	): Promise<void> {
		await this.groundsService.removeGround(groundId);
	}
}
