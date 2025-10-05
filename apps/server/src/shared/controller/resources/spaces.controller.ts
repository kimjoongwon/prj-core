import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Logger,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	ApiResponseEntity,
	CreateSpaceDto,
	QuerySpaceDto,
	ResponseEntity,
	SpaceDto,
	UpdateSpaceDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ContextProvider } from "../../provider";
import { SpacesService } from "../../service";

@ApiTags("SPACES")
@Controller()
export class SpacesController {
	private readonly logger = new Logger(SpacesController.name);

	constructor(private readonly service: SpacesService) {}

	@Get("current")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async getCurrentSpace(): Promise<ResponseEntity<SpaceDto>> {
		console.log("=== getCurrentSpace 호출됨 ===");
		const startTime = Date.now();
		this.logger.log("🚀 getCurrentSpace API 호출됨");

		const tenant = ContextProvider.getTenant();
		const tenantId = ContextProvider.getTenantId();
		const spaceId = ContextProvider.getSpaceId();
		const userId = ContextProvider.getAuthUserId();

		// 디버깅을 위한 상세한 로깅
		this.logger.debug("getCurrentSpace - 컨텍스트 정보:", {
			hasTenant: !!tenant,
			tenantId: tenantId?.slice(-8) || "null",
			spaceId: spaceId?.slice(-8) || "null",
			tenantSpaceId: tenant?.spaceId?.slice(-8) || "null",
			userId: userId?.slice(-8) || "null",
			timestamp: new Date().toISOString(),
		});

		if (!tenant) {
			this.logger.warn("getCurrentSpace - 컨텍스트에서 테넌트를 찾을 수 없음");
			throw new HttpException(
				"Tenant information not found.! Please log in again.",
				HttpStatus.UNAUTHORIZED,
			);
		}

		if (!tenant.spaceId) {
			this.logger.warn("getCurrentSpace - No spaceId in tenant:", {
				tenantId: tenant.id?.slice(-8),
				hasSpaceId: !!tenant.spaceId,
			});
			throw new HttpException(
				"Space ID is missing from tenant information. Please select a space.",
				HttpStatus.BAD_REQUEST,
			);
		}

		try {
			const space = await this.service.getById(tenant.spaceId);

			if (!space) {
				this.logger.warn("getCurrentSpace - 스페이스를 찾을 수 없음:", {
					spaceId: tenant.spaceId?.slice(-8),
				});
				throw new HttpException(
					`ID로 스페이스를 찾을 수 없음: ${tenant.spaceId}`,
					HttpStatus.NOT_FOUND,
				);
			}

			const duration = Date.now() - startTime;
			this.logger.log("getCurrentSpace - 성공:", {
				spaceId: space.id?.slice(-8),
				spaceName: space.ground?.name || "no-ground",
				duration: `${duration}ms`,
			});

			return new ResponseEntity(HttpStatus.OK, "성공", space?.toDto?.());
		} catch (error) {
			const duration = Date.now() - startTime;
			this.logger.error("getCurrentSpace - 오류:", {
				error: error instanceof Error ? error.message : String(error),
				spaceId: tenant.spaceId?.slice(-8),
				duration: `${duration}ms`,
			});
			throw error;
		}
	}
	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
		const space = await this.service.create(createSpaceDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceDto, space),
		);
	}

	@Get(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async getSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.getById(spaceId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceDto, space),
		);
	}

	@Patch(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async updateSpace(
		@Param("spaceId") spaceId: string,
		@Body() updateSpaceDto: UpdateSpaceDto,
	) {
		const space = await this.service.updateById(spaceId, updateSpaceDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceDto, space),
		);
	}

	@Patch(":spaceId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async removeSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.removeById(spaceId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceDto, space),
		);
	}

	@Delete(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async deleteSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.deleteById(spaceId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceDto, space),
		);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	async getSpacesByQuery(@Query() query: QuerySpaceDto) {
		const { count, spaces } = await this.service.getManyByQuery(query);

		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			spaces.map((space) => space?.toDto?.() ?? space),
			query.toPageMetaDto(count),
		);
	}
}
