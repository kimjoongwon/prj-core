import { CONTEXT_KEYS, type SystemRoleName } from "@cocrepo/constant";
import { ROLES_KEY } from "@cocrepo/decorator";
import type { ContextTenantSnapshot, ContextUserSnapshot } from "@cocrepo/type";
import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isEmpty } from "lodash";
import { ClsService } from "nestjs-cls";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly cls: ClsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<SystemRoleName[]>(
			ROLES_KEY,
			context.getHandler(),
		);

		if (isEmpty(roles)) {
			return true;
		}

		const user = this.cls.get<ContextUserSnapshot | undefined>(
			CONTEXT_KEYS.AUTH_USER,
		);

		if (!user) {
			throw new UnauthorizedException("인증된 사용자가 필요합니다.");
		}

		if (!user.tenants || user.tenants.length === 0) {
			throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");
		}

		// CLS에서 tenant 읽기 (RequestContextMiddleware가 설정)
		const tenant = this.cls.get<ContextTenantSnapshot | undefined>(
			CONTEXT_KEYS.TENANT,
		);
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);

		if (!tenant) {
			throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
		}

		if (!tenant.role) {
			throw new ForbiddenException("테넌트에 역할이 할당되지 않았습니다.");
		}

		const hasRequiredRole = roles.includes(tenant.role.name as SystemRoleName);
		if (!hasRequiredRole) {
			const endpoint = `${context.getClass().name}.${context.getHandler().name}`;
			throw new ForbiddenException(
				`[RolesGuard] 접근 거부\n` +
					`- 엔드포인트: ${endpoint}\n` +
					`- 사용자: ${user.id} (space: ${spaceId ?? "없음"})\n` +
					`- 현재 역할: ${tenant.role.name}\n` +
					`- 요구 조건: ${roles.join(", ")}`,
			);
		}

		return true;
	}
}
