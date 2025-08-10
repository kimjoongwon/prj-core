import {
	applyDecorators,
	SetMetadata,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { $Enums, RoleCategoryNames } from "@shared/schema";
import { JwtAuthGuard } from "../guard";
import { RoleCategoryGuard } from "../guard/role-category.guard";
import { RoleGroupGuard } from "../guard/role-group.guard";
import { RolesGuard } from "../guard/roles.guard";
import { AuthUserInterceptor } from "../interceptor";
import { PublicRoute } from "./public-route.decorator";
import { RoleCategories } from "./role-categories.decorator";
import { RoleGroups } from "./role-groups.decorator";
import { Roles } from "./roles.decorator";

export interface AuthOptions {
	roles?: $Enums.Roles[];
	groups?: string[];
	categories?: RoleCategoryNames[];
	public?: boolean;
	injectTenant?: boolean;
}

export const AUTH_OPTIONS_KEY = "authOptions";

export function Auth(options: AuthOptions = {}): MethodDecorator {
	const {
		roles = ["USER"], // 기본값: USER 역할
		public: isPublicRoute = false, // 기본값: false (비공개 라우트)
		injectTenant = true, // 기본값: true (tenantId 자동 주입)
		groups = [], // 역할 그룹
		categories = [], // 역할 카테고리
	} = options;

	const decorators = [
		ApiCookieAuth("accessToken"),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		SetMetadata(AUTH_OPTIONS_KEY, {
			public: isPublicRoute,
			injectTenant,
		}),
		PublicRoute(isPublicRoute),
		Roles(roles),
	];

	if (groups.length > 0) {
		decorators.push(RoleGroups(groups));
	}

	if (categories.length > 0) {
		decorators.push(RoleCategories(categories));
	}

	if (!isPublicRoute) {
		decorators.push(UseGuards(JwtAuthGuard));
		decorators.push(UseGuards(RolesGuard));

		if (categories.length > 0) {
			decorators.push(UseGuards(RoleCategoryGuard));
		}

		if (groups.length > 0) {
			decorators.push(UseGuards(RoleGroupGuard));
		}
	}

	decorators.push(UseInterceptors(AuthUserInterceptor));

	return applyDecorators(...decorators);
}
