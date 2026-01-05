import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SaveUIConfigDto, UIConfigResponseDto } from "@cocrepo/dto";
import { UIConfig, User } from "@cocrepo/entity";
import { UIConfigService } from "@cocrepo/service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Put,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

/**
 * UIConfig 에러 메시지 상수
 */
const UIConfigErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	SPACE_NOT_SELECTED:
		"Space가 선택되지 않았습니다. X-Space-ID 헤더를 확인해주세요.",
	ROLE_NOT_FOUND: "역할을 찾을 수 없습니다",
	CONFIG_NOT_FOUND: "UI 설정을 찾을 수 없습니다",
} as const;

/**
 * UI Config 컨트롤러
 *
 * 하이브리드 UI Config 시스템의 REST API를 제공합니다.
 * - 코드 기본값(FieldRegistry)은 프론트엔드에서 관리
 * - DB 오버라이드(UIConfig)만 이 API에서 관리
 *
 * 우선순위: USER > ROLE > GLOBAL
 */
@ApiTags("UI-CONFIGS")
@Controller()
export class UIConfigController {
	constructor(
		private readonly uiConfigService: UIConfigService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 사용자에게 적용될 설정 조회
	 * GET /api/v1/ui-configs/:entity/:view
	 *
	 * 우선순위(USER > ROLE > GLOBAL)에 따라 가장 구체적인 설정을 반환합니다.
	 * 설정이 없으면 null 반환 (프론트엔드에서 코드 기본값 사용)
	 */
	@Get(":entity/:view")
	@ApiOperation({
		summary: "UI 설정 조회",
		description:
			"현재 사용자에게 적용될 UI 설정을 조회합니다. 우선순위(USER > ROLE > GLOBAL)에 따라 가장 구체적인 설정을 반환합니다. 설정이 없으면 null을 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "entity",
		description: "엔티티명 (예: User, Reservation, Ground)",
		type: String,
		example: "User",
	})
	@ApiParam({
		name: "view",
		description: "뷰 타입 (table, form, detail, card)",
		type: String,
		example: "table",
	})
	@ApiErrors(
		{ status: 401, message: UIConfigErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UIConfigErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UIConfigResponseDto, HttpStatus.OK)
	@ResponseMessage("UI 설정 조회 성공")
	async getConfig(
		@Param("entity") entity: string,
		@Param("view") view: string,
	): Promise<UIConfig | null> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UIConfigErrorMessages.USER_NOT_FOUND);
		}

		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(UIConfigErrorMessages.SPACE_NOT_SELECTED);
		}

		// 현재 Space에 해당하는 Tenant에서 Role ID 추출
		const currentTenant = user.tenants?.find((t) => t.spaceId === spaceId);
		const roleId = currentTenant?.roleId ?? undefined;

		return this.uiConfigService.getConfig({
			spaceId,
			entity,
			view,
			userId: user.id,
			roleId,
		});
	}

	/**
	 * 사용자 개인 설정 저장
	 * PUT /api/v1/ui-configs/:entity/:view
	 *
	 * 개인 컬럼 순서, 너비 조정 등 사용자별 UI 커스터마이징을 저장합니다.
	 */
	@Put(":entity/:view")
	@ApiOperation({
		summary: "사용자 개인 설정 저장",
		description:
			"현재 사용자의 개인 UI 설정을 저장합니다. 컬럼 순서, 너비 조정 등을 커스터마이징할 수 있습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "entity",
		description: "엔티티명 (예: User, Reservation, Ground)",
		type: String,
		example: "User",
	})
	@ApiParam({
		name: "view",
		description: "뷰 타입 (table, form, detail, card)",
		type: String,
		example: "table",
	})
	@ApiBody({
		type: SaveUIConfigDto,
		description: "저장할 UI 설정 데이터",
	})
	@ApiErrors(
		{ status: 401, message: UIConfigErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UIConfigErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UIConfigResponseDto, HttpStatus.OK)
	@ResponseMessage("사용자 개인 설정 저장 성공")
	async saveUserConfig(
		@Param("entity") entity: string,
		@Param("view") view: string,
		@Body() body: SaveUIConfigDto,
	): Promise<UIConfig> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UIConfigErrorMessages.USER_NOT_FOUND);
		}

		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(UIConfigErrorMessages.SPACE_NOT_SELECTED);
		}

		// DTO를 JSON 객체로 변환
		const config = JSON.parse(
			JSON.stringify({
				fields: body.fields,
				defaultSort: body.defaultSort,
				pageSize: body.pageSize,
			}),
		);

		return this.uiConfigService.saveUserConfig(
			spaceId,
			entity,
			view,
			user.id,
			config,
		);
	}

	/**
	 * 역할별 설정 저장 (관리자)
	 * PUT /api/v1/ui-configs/:entity/:view/role/:roleId
	 *
	 * 특정 역할에 대한 기본 UI 설정을 저장합니다.
	 * 해당 역할을 가진 모든 사용자에게 적용됩니다 (개인 설정이 없는 경우).
	 */
	@Put(":entity/:view/role/:roleId")
	@ApiOperation({
		summary: "역할별 설정 저장 (관리자)",
		description:
			"특정 역할에 대한 기본 UI 설정을 저장합니다. 해당 역할을 가진 모든 사용자에게 적용됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "entity",
		description: "엔티티명 (예: User, Reservation, Ground)",
		type: String,
		example: "User",
	})
	@ApiParam({
		name: "view",
		description: "뷰 타입 (table, form, detail, card)",
		type: String,
		example: "table",
	})
	@ApiParam({
		name: "roleId",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: SaveUIConfigDto,
		description: "저장할 UI 설정 데이터",
	})
	@ApiErrors(
		{ status: 401, message: UIConfigErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UIConfigErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UIConfigResponseDto, HttpStatus.OK)
	@ResponseMessage("역할별 설정 저장 성공")
	async saveRoleConfig(
		@Param("entity") entity: string,
		@Param("view") view: string,
		@Param("roleId", ParseUUIDPipe) roleId: string,
		@Body() body: SaveUIConfigDto,
	): Promise<UIConfig> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UIConfigErrorMessages.USER_NOT_FOUND);
		}

		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(UIConfigErrorMessages.SPACE_NOT_SELECTED);
		}

		// DTO를 JSON 객체로 변환
		const config = JSON.parse(
			JSON.stringify({
				fields: body.fields,
				defaultSort: body.defaultSort,
				pageSize: body.pageSize,
			}),
		);

		return this.uiConfigService.saveRoleConfig(
			spaceId,
			entity,
			view,
			roleId,
			config,
		);
	}

	/**
	 * Space 기본 설정 저장 (관리자)
	 * PUT /api/v1/ui-configs/:entity/:view/global
	 *
	 * Space 전체의 기본 UI 설정을 저장합니다.
	 * 역할별, 개인별 설정이 없는 경우 이 설정이 적용됩니다.
	 */
	@Put(":entity/:view/global")
	@ApiOperation({
		summary: "Space 기본 설정 저장 (관리자)",
		description:
			"Space 전체의 기본 UI 설정을 저장합니다. 역할별, 개인별 설정이 없는 경우 이 설정이 적용됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "entity",
		description: "엔티티명 (예: User, Reservation, Ground)",
		type: String,
		example: "User",
	})
	@ApiParam({
		name: "view",
		description: "뷰 타입 (table, form, detail, card)",
		type: String,
		example: "table",
	})
	@ApiBody({
		type: SaveUIConfigDto,
		description: "저장할 UI 설정 데이터",
	})
	@ApiErrors(
		{ status: 401, message: UIConfigErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UIConfigErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UIConfigResponseDto, HttpStatus.OK)
	@ResponseMessage("Space 기본 설정 저장 성공")
	async saveGlobalConfig(
		@Param("entity") entity: string,
		@Param("view") view: string,
		@Body() body: SaveUIConfigDto,
	): Promise<UIConfig> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UIConfigErrorMessages.USER_NOT_FOUND);
		}

		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(UIConfigErrorMessages.SPACE_NOT_SELECTED);
		}

		// DTO를 JSON 객체로 변환
		const config = JSON.parse(
			JSON.stringify({
				fields: body.fields,
				defaultSort: body.defaultSort,
				pageSize: body.pageSize,
			}),
		);

		return this.uiConfigService.saveGlobalConfig(spaceId, entity, view, config);
	}

	/**
	 * 설정 삭제
	 * DELETE /api/v1/ui-configs/:id
	 *
	 * UI 설정을 삭제하면 코드 기본값이 적용됩니다.
	 */
	@Delete(":id")
	@ApiOperation({
		summary: "UI 설정 삭제",
		description: "UI 설정을 삭제합니다. 삭제 후 코드 기본값이 적용됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "UIConfig ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: UIConfigErrorMessages.USER_NOT_FOUND },
		{ status: 404, message: UIConfigErrorMessages.CONFIG_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UIConfigResponseDto, HttpStatus.OK)
	@ResponseMessage("UI 설정 삭제 성공")
	async deleteConfig(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<UIConfig> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UIConfigErrorMessages.USER_NOT_FOUND);
		}

		return this.uiConfigService.deleteConfig(id);
	}
}
