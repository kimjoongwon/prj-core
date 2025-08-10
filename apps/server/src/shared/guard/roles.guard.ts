import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { $Enums, UserDto } from "@shared/schema";
import { isEmpty } from "lodash";
import { Roles } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<$Enums.Roles[]>(
			Roles,
			context.getHandler(),
		);

		if (isEmpty(roles)) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = <UserDto>request.user;

		if (!user) {
			throw new ForbiddenException("인증된 사용자가 필요합니다.");
		}

		if (!user.tenants || user.tenants.length === 0) {
			throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");
		}

		// Find main tenant as fallback
		const tenant = user.tenants.find((tenant) => tenant.main);

		if (!tenant) {
			throw new ForbiddenException("메인 테넌트가 설정되지 않았습니다.");
		}

		if (!tenant.role) {
			throw new ForbiddenException("테넌트에 역할이 할당되지 않았습니다.");
		}

		const hasRequiredRole = roles.includes(tenant.role.name as $Enums.Roles);
		if (!hasRequiredRole) {
			throw new ForbiddenException(
				`이 작업을 수행하려면 다음 역할 중 하나가 필요합니다: ${roles.join(", ")}. 현재 역할: ${tenant.role.name}`,
			);
		}

		return true;
	}
}
