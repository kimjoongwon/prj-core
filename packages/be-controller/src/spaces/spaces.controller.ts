import {
	CreateSpaceCommand,
	GetSpaceGroundQuery,
	ListSpacesQuery,
	UpdateSpaceGroundCommand,
} from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/context";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateGroundDto,
	GroundDto,
	QuerySpaceDto,
	SpaceDto,
	UpdateGroundDto,
} from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("SPACES")
@Controller()
export class SpacesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getSpaces",
		summary: "공간 목록 조회",
		description: "Company와 Ground detail이 있는 Space 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("공간 목록 조회 성공")
	async getSpaces(@Query() query: QuerySpaceDto) {
		return this.queryBus.execute(
			new ListSpacesQuery({
				...query,
				spaceIds: this.spaceContext.spaceIds,
			}),
		);
	}

	@Get(":spaceId/ground")
	@ApiOperation({
		operationId: "getSpaceGround",
		summary: "공간의 시설 detail 조회",
		description:
			"Space의 Company 아래에 연결된 대표 서비스 Ground detail을 조회합니다.",
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
		this.assertSpaceAccess(spaceId);
		return this.queryBus.execute(new GetSpaceGroundQuery(spaceId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createSpace",
		summary: "공간 생성",
		description: "Space root와 Company/Ground detail을 함께 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateGroundDto,
		description: "공간 생성에 필요한 Company/Ground detail 정보",
	})
	@ApiErrors(401, 409, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.CREATED)
	@ResponseMessage("공간 생성 성공")
	async createSpace(@Body() dto: CreateGroundDto): Promise<Space> {
		return this.commandBus.execute(new CreateSpaceCommand(dto));
	}

	@Patch(":spaceId/ground")
	@ApiOperation({
		operationId: "updateSpaceGround",
		summary: "공간의 시설 detail 수정",
		description:
			"Space의 Company 아래에 연결된 대표 서비스 Ground detail을 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateGroundDto,
		description: "수정할 Company/Ground detail 정보",
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("공간 시설 수정 성공")
	async updateSpaceGround(
		@Param("spaceId", ParseUUIDPipe) spaceId: string,
		@Body() dto: UpdateGroundDto,
	): Promise<Space> {
		this.assertSpaceAccess(spaceId);
		return this.commandBus.execute(new UpdateSpaceGroundCommand(spaceId, dto));
	}

	private assertSpaceAccess(spaceId: string): void {
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException("해당 Space 리소스에 접근할 수 없습니다.");
		}
	}
}
