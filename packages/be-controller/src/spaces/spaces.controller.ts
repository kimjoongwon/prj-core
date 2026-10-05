import { ParseBigIntIdPipe } from "@cocrepo/be-common";
import {
	CreateSpaceCommand,
	GetSpaceFitnessCenterQuery,
	ListSpacesQuery,
	UpdateSpaceFitnessCenterCommand,
} from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/context";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateSpaceWithFitnessCenterDto,
	FitnessCenterDto,
	QuerySpaceDto,
	SpaceDto,
	UpdateFitnessCenterDto,
} from "@cocrepo/dto";
import type { FitnessCenter, Space } from "@cocrepo/entity";
import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	Param,
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
		description: "FitnessCenter detail이 포함된 Space 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("공간 목록 조회 성공")
	@HttpCode(HttpStatus.OK)
	async getSpaces(@Query() query: QuerySpaceDto) {
		return this.queryBus.execute(
			new ListSpacesQuery({
				...query,
				spaceIds: this.spaceContext.spaceIds,
			}),
		);
	}

	@Get(":spaceId/fitness-center")
	@ApiOperation({
		operationId: "getSpaceFitnessCenter",
		summary: "공간의 시설 detail 조회",
		description: "Space에 연결된 FitnessCenter detail을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(FitnessCenterDto, HttpStatus.OK)
	@ResponseMessage("공간 시설 조회 성공")
	@HttpCode(HttpStatus.OK)
	async getSpaceFitnessCenter(
		@Param("spaceId", ParseBigIntIdPipe) spaceId: bigint,
	): Promise<FitnessCenter> {
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException("해당 Space 리소스에 접근할 수 없습니다.");
		}

		return this.queryBus.execute(new GetSpaceFitnessCenterQuery(spaceId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createSpace",
		summary: "공간 생성",
		description: "Space root와 FitnessCenter detail을 함께 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateSpaceWithFitnessCenterDto,
		description: "공간 생성에 필요한 FitnessCenter 정보",
	})
	@ApiErrors(401, 409, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.CREATED)
	@ResponseMessage("공간 생성 성공")
	async createSpace(
		@Body() dto: CreateSpaceWithFitnessCenterDto,
	): Promise<Space> {
		return this.commandBus.execute(new CreateSpaceCommand(dto));
	}

	@Patch(":spaceId/fitness-center")
	@ApiOperation({
		operationId: "updateSpaceFitnessCenter",
		summary: "공간의 시설 detail 수정",
		description:
			"Space에 연결된 FitnessCenter detail과 Space 콘텐츠 언어를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "spaceId",
		description: "Space ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiBody({
		type: UpdateFitnessCenterDto,
		description: "수정할 FitnessCenter 정보와 Space 콘텐츠 언어",
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("공간 시설 수정 성공")
	@HttpCode(HttpStatus.OK)
	async updateSpaceFitnessCenter(
		@Param("spaceId", ParseBigIntIdPipe) spaceId: bigint,
		@Body() dto: UpdateFitnessCenterDto,
	): Promise<Space> {
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException("해당 Space 리소스에 접근할 수 없습니다.");
		}

		return this.commandBus.execute(
			new UpdateSpaceFitnessCenterCommand(spaceId, dto),
		);
	}
}
