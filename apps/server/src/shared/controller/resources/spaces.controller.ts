import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateSpaceDto,
	QuerySpaceDto,
	SpaceDto,
	TenantDto,
	UpdateSpaceDto,
	UserDto,
} from "@cocrepo/dto";
import { SpacesService } from "@cocrepo/service";
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
import { ClsService } from "nestjs-cls";
import { wrapResponse } from "../../util/response.util";

@ApiTags("SPACES")
@Controller()
export class SpacesController {
	private readonly logger = new Logger(SpacesController.name);

	constructor(
		private readonly service: SpacesService,
		private readonly cls: ClsService,
	) {}

	@Get("current")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async getCurrentSpace() {
		console.log("=== getCurrentSpace 호출됨 ===");
		const startTime = Date.now();
		this.logger.log("🚀 getCurrentSpace API 호출됨");

		const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
		const tenantId = tenant?.id;
		const spaceId = tenant?.spaceId;
		const userId = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER)?.id;

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

			return space?.toDto?.();
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
		return space;
	}

	@Get(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async getSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.getById(spaceId);
		return space;
	}

	@Patch(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async updateSpace(
		@Param("spaceId") spaceId: string,
		@Body() updateSpaceDto: UpdateSpaceDto,
	) {
		const space = await this.service.updateById(spaceId, updateSpaceDto);
		return space;
	}

	@Patch(":spaceId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async removeSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.removeById(spaceId);
		return space;
	}

	@Delete(":spaceId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	async deleteSpace(@Param("spaceId") spaceId: string) {
		const space = await this.service.deleteById(spaceId);
		return space;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	async getSpacesByQuery(@Query() query: QuerySpaceDto) {
		const { count, spaces } = await this.service.getManyByQuery(query);

		return wrapResponse(
			spaces.map((space) => space?.toDto?.() ?? space),
			{
				message: "success",
				meta: query.toPageMetaDto(count),
			},
		);
	}
}
