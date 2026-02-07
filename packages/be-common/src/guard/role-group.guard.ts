import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ROLE_GROUPS_KEY } from "@cocrepo/decorator";
import { TenantDto, UserDto } from "@cocrepo/dto";
import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import { isEmpty } from "lodash";

@Injectable()
export class RoleGroupGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly cls: ClsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const roleGroups = this.reflector.get<string[]>(
			ROLE_GROUPS_KEY,
			context.getHandler(),
		);

		if (isEmpty(roleGroups)) {
			return true;
		}

		const user = this.cls.get<UserDto | undefined>(CONTEXT_KEYS.AUTH_USER);

		if (!user) {
			throw new UnauthorizedException("인증된 사용자가 필요합니다.");
		}

		if (!user.tenants || user.tenants.length === 0) {
			throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");
		}

		// CLS에서 tenant 읽기 (RequestContextMiddleware가 설정)
		const tenant = this.cls.get<TenantDto | undefined>(CONTEXT_KEYS.TENANT);
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);

		if (!tenant) {
			throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
		}

		if (!tenant.role) {
			throw new ForbiddenException("테넌트에 역할이 할당되지 않았습니다.");
		}

		// Check if the user's role belongs to any of the required role groups
		const userRoleGroups =
			tenant.role.associations?.map((ac) => ac.group?.name) || [];

		const hasRequiredRoleGroup = roleGroups.some((requiredGroup) =>
			userRoleGroups.includes(requiredGroup),
		);

		if (!hasRequiredRoleGroup) {
			const endpoint = `${context.getClass().name}.${context.getHandler().name}`;
			throw new ForbiddenException(
				`[RoleGroupGuard] 접근 거부\n` +
					`- 엔드포인트: ${endpoint}\n` +
					`- 사용자: ${user.id} (space: ${spaceId ?? "없음"})\n` +
					`- 현재 역할 그룹: ${userRoleGroups.filter(Boolean).join(", ") || "없음"}\n` +
					`- 요구 조건: ${roleGroups.join(", ")}`,
			);
		}

		return true;
	}
}
