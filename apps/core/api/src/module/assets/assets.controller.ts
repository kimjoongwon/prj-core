import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { AssetDto, AssetQueryDto, MoveAssetDto } from "@cocrepo/dto";
import { AssetFacade } from "@cocrepo/facade";
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
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("ASSETS")
@Controller()
export class AssetsController {
	constructor(private readonly assetFacade: AssetFacade) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getAssets",
		summary: "에셋 목록 조회",
		description:
			"현재 선택한 Space의 에셋 목록을 조회합니다. 검색, 상태, 타입, 폴더 필터와 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("에셋 목록 조회 성공")
	async getAssets(@Query() query: AssetQueryDto) {
		return this.assetFacade.getAssets(query);
	}

	@Get(":assetId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getAssetById",
		summary: "에셋 상세 조회",
		description: "현재 선택한 Space에 속한 에셋 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 상세 조회 성공")
	async getAssetById(@Param("assetId", ParseUUIDPipe) assetId: string) {
		return this.assetFacade.getAssetById(assetId);
	}

	@Patch(":assetId/move")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "moveAsset",
		summary: "에셋 폴더 이동",
		description: "현재 선택한 Space 안에서 에셋의 소속 폴더를 변경합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: MoveAssetDto,
		description: "이동할 대상 폴더 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 이동 성공")
	async moveAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Body() dto: MoveAssetDto,
	) {
		return this.assetFacade.moveAsset(assetId, dto);
	}

	@Delete(":assetId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "removeAsset",
		summary: "에셋 삭제",
		description: "현재 선택한 Space에 속한 에셋을 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("에셋 삭제 성공")
	async removeAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<void> {
		await this.assetFacade.deleteAsset(assetId);
	}
}
