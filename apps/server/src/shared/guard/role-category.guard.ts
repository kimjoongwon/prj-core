import {
	CanActivate,
	ExecutionContext,
	Injectable,
	ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserDto } from "@shared/schema";
import { isEmpty } from "lodash";

@Injectable()
export class RoleCategoryGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roleCategories = this.reflector.get<string[]>(
			"roleCategories",
			context.getHandler(),
		);

		if (isEmpty(roleCategories)) {
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

		// Check if the user's role belongs to any of the required role categories
		const userRoleCategories =
			tenant.role.classifications?.map((cl) => cl.category?.name) || [];

		const hasRequiredRoleCategory = roleCategories.some((requiredCategory) =>
			userRoleCategories.includes(requiredCategory),
		);

		if (!hasRequiredRoleCategory) {
			throw new ForbiddenException(
				`이 작업을 수행하려면 다음 역할 카테고리 중 하나에 속해야 합니다: ${roleCategories.join(", ")}. 현재 사용자의 역할 카테고리: ${userRoleCategories.join(", ")}`,
			);
		}

		return true;
	}
}
