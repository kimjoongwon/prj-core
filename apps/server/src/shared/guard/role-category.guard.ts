import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Category, RoleCategoryNames, UserDto } from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { isEmpty } from "lodash";

@Injectable()
export class RoleCategoryGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roleCategories = this.reflector.get<RoleCategoryNames[]>(
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

		// Extract category hierarchy names (parents and children) using entity methods
		let userCategoryHierarchy: string[] = [];

		if (tenant.role.classification?.category) {
			const categoryEntity = plainToInstance(
				Category,
				tenant.role.classification.category,
			);

			// Get parent names (current category + all ancestors)
			const parentNames = categoryEntity.getAllParentNames();

			// Get children names (all descendants)
			const childrenNames = categoryEntity.getAllChildrenNames();

			// Combine both hierarchies (remove duplicates with Set)
			userCategoryHierarchy = [...new Set([...parentNames, ...childrenNames])];
		}

		// Check if any of the user's category hierarchy matches required role categories
		const hasRequiredRoleCategory = roleCategories.some((requiredCategory) =>
			userCategoryHierarchy.includes(requiredCategory.name),
		);

		if (!hasRequiredRoleCategory) {
			throw new ForbiddenException(
				`이 작업을 수행하려면 다음 역할 카테고리 중 하나에 속해야 합니다: ${roleCategories.map((category) => category.name).join(", ")}.
				현재 사용자의 역할 카테고리 계층: ${userCategoryHierarchy.join(" → ")}`,
			);
		}

		return true;
	}
}
