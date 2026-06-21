import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { TenantDto, UserDto } from "@cocrepo/dto";
import {
	BadRequestException,
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import {
	resolveCurrentTenantById,
	resolveTenantSpaceId,
} from "../util/permission.util";

@Injectable()
export class SpaceAccessGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly cls: ClsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		// @PublicRoute이면 skip (메서드 → 클래스 순으로 확인)
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			PUBLIC_ROUTE_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (isPublic) return true;

		// @SkipSpaceCheck이면 skip (메서드 → 클래스 순으로 확인)
		const skipSpaceCheck = this.reflector.getAllAndOverride<boolean>(
			SKIP_SPACE_CHECK_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (skipSpaceCheck) return true;

		const user = this.cls.get<UserDto | undefined>(CONTEXT_KEYS.AUTH_USER);

		// 인증되지 않은 요청은 skip (JwtAuthGuard가 이미 처리)
		if (!user) return true;

		// CLS에서 tenantId 확인
		const tenantId = this.cls.get<string | undefined>(CONTEXT_KEYS.TENANT_ID);
		if (!tenantId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Tenant를 선택해주세요.",
			);
		}

		// Tenant 접근 권한 확인
		if (!Array.isArray(user.tenants) || user.tenants.length === 0) {
			throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");
		}

		const tenant =
			this.cls.get<TenantDto | undefined>(CONTEXT_KEYS.TENANT) ??
			resolveCurrentTenantById(user.tenants, tenantId);
		if (!tenant) {
			throw new ForbiddenException("해당 Tenant에 대한 접근 권한이 없습니다.");
		}

		this.cls.set(CONTEXT_KEYS.TENANT, tenant);
		this.cls.set(CONTEXT_KEYS.SPACE_ID, resolveTenantSpaceId(tenant));

		return true;
	}
}
