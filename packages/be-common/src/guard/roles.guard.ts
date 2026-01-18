import { CONTEXT_KEYS, type SystemRoleName } from "@cocrepo/constant";
import { ROLES_KEY } from "@cocrepo/decorator";
import { UserDto } from "@cocrepo/dto";
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
		const roles = this.reflector.get<SystemRoleName[]>(ROLES_KEY, context.getHandler());

		if (isEmpty(roles)) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = <UserDto>request.user;

		if (!user) {
			throw new UnauthorizedException("인증된 사용자가 필요합니다.");
		}

		if (!user.tenants || user.tenants.length === 0) {
			throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");
		}

		// x-space-id 헤더에서 spaceId 가져오기
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);

		// spaceId로 해당 tenant 찾기
		const tenant = spaceId
			? user.tenants.find((t) => t.spaceId === spaceId)
			: user.tenants[0]; // spaceId가 없으면 첫 번째 tenant 사용

		if (!tenant) {
			throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
		}

		if (!tenant.role) {
			throw new ForbiddenException("테넌트에 역할이 할당되지 않았습니다.");
		}

		const hasRequiredRole = roles.includes(tenant.role.name as SystemRoleName);
		if (!hasRequiredRole) {
			throw new ForbiddenException(
				`이 작업을 수행하려면 다음 역할 중 하나가 필요합니다: ${roles.join(", ")}. 현재 역할: ${tenant.role.name}`,
			);
		}

		return true;
	}
}
