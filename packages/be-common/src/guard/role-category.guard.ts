import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ROLE_CATEGORIES_KEY } from "@cocrepo/decorator";
import { TenantDto, UserDto } from "@cocrepo/dto";
import { Category } from "@cocrepo/entity";
import { RoleCategoryNames } from "@cocrepo/enum";
import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { plainToInstance } from "class-transformer";
import { ClsService } from "nestjs-cls";
import { isEmpty } from "lodash";

@Injectable()
export class RoleCategoryGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly cls: ClsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const roleCategories = this.reflector.get<RoleCategoryNames[]>(
			ROLE_CATEGORIES_KEY,
			context.getHandler(),
		);

		if (isEmpty(roleCategories)) {
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
			const endpoint = `${context.getClass().name}.${context.getHandler().name}`;
			throw new ForbiddenException(
				`[RoleCategoryGuard] 접근 거부\n` +
					`- 엔드포인트: ${endpoint}\n` +
					`- 사용자: ${user.id} (space: ${spaceId ?? "없음"})\n` +
					`- 현재 역할 카테고리 계층: ${userCategoryHierarchy.join(" → ") || "없음"}\n` +
					`- 요구 조건: ${roleCategories.map((c) => c.name).join(", ")}`,
			);
		}

		return true;
	}
}
