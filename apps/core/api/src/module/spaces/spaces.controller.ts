import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateGroundDto,
	GroundDto,
	SpaceDto,
	UpdateGroundDto,
} from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import { SpaceFacade } from "@cocrepo/facade";
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
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("SPACES")
@Controller()
export class SpacesController {
	constructor(private readonly spacesService: SpaceFacade) {}

	@Public()
	@Get()
	@ApiOperation({
		operationId: "getSpaces",
		summary: "공간 목록 조회",
		description: "Ground detail이 있는 Space 목록을 조회합니다.",
	})
	@ApiErrors(500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("공간 목록 조회 성공")
	async getSpaces() {
		return this.spacesService.listSpaces();
	}

	@Get(":spaceId/ground")
	@ApiOperation({
		operationId: "getSpaceGround",
		summary: "공간의 시설 detail 조회",
		description: "Space에 종속된 1:1 Ground detail을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK)
	@ResponseMessage("공간 시설 조회 성공")
	async getSpaceGround(
		@Param("spaceId", ParseUUIDPipe) spaceId: string,
	): Promise<Ground> {
		return this.spacesService.getGroundBySpaceId(spaceId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createSpace",
		summary: "공간 생성",
		description: "Space root와 Ground detail을 함께 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateGroundDto,
		description: "공간 생성에 필요한 Ground detail 정보",
	})
	@ApiErrors(401, 409, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.CREATED)
	@ResponseMessage("공간 생성 성공")
	async createSpace(@Body() dto: CreateGroundDto): Promise<Space> {
		return this.spacesService.createSpaceWithGround(dto);
	}

	@Patch(":spaceId/ground")
	@ApiOperation({
		operationId: "updateSpaceGround",
		summary: "공간의 시설 detail 수정",
		description: "Space에 종속된 1:1 Ground detail을 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateGroundDto,
		description: "수정할 Ground detail 정보",
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("공간 시설 수정 성공")
	async updateSpaceGround(
		@Param("spaceId", ParseUUIDPipe) spaceId: string,
		@Body() dto: UpdateGroundDto,
	): Promise<Space> {
		return this.spacesService.updateGroundBySpaceId(spaceId, dto);
	}

	@Delete(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "deleteSpace",
		summary: "공간 삭제",
		description: "Space root와 종속 Ground detail을 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("공간 삭제 성공")
	async deleteSpace(
		@Param("spaceId", ParseUUIDPipe) spaceId: string,
	): Promise<Space> {
		return this.spacesService.deleteSpace(spaceId);
	}
}
