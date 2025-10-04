// import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
// import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
// import { $Enums, RoleCategoryNames } from "@shared/schema";
// import { RoleCategoryGuard } from "../guard/role-category.guard";
// import { RoleGroupGuard } from "../guard/role-group.guard";
// import { RolesGuard } from "../guard/roles.guard";
// import { Public } from "./public.decorator";
// import { RoleGroups } from "./role-groups.decorator";

// export interface AuthOptions {
// 	roles?: $Enums.Roles[];
// 	groups?: string[];
// 	categories?: RoleCategoryNames[];
// 	public?: boolean;
// 	injectTenant?: boolean;
// }

// export const AUTH_OPTIONS_KEY = "authOptions";

// export function Auth(options: AuthOptions = {}): MethodDecorator {
// 	const {
// 		roles = ["USER"], // 기본값: USER 역할
// 		public: isPublicRoute = false, // 기본값: false (비공개 라우트)
// 		injectTenant = true, // 기본값: true (tenantId 자동 주입)
// 		groups = [], // 역할 그룹
// 		categories = [], // 역할 카테고리
// 	} = options;

// 	const decorators = [
// 		ApiCookieAuth("accessToken"),
// 		ApiUnauthorizedResponse({ description: "Unauthorized" }),
// 		SetMetadata(AUTH_OPTIONS_KEY, {
// 			public: isPublicRoute,
// 			injectTenant,
// 		}),
// 		Roles(roles),
// 	];

// 	// Public 라우트 처리
// 	if (isPublicRoute) {
// 		decorators.push(Public());
// 		return applyDecorators(...decorators);
// 	}

// 	// 역할 기반 권한 검증 추가 (JWT는 전역으로 처리됨)
// 	decorators.push(UseGuards(RolesGuard));

// 	if (groups.length > 0) {
// 		decorators.push(RoleGroups(groups));
// 		decorators.push(UseGuards(RoleGroupGuard));
// 	}

// 	if (categories.length > 0) {
// 		decorators.push(RoleCategories(categories));
// 		decorators.push(UseGuards(RoleCategoryGuard));
// 	}

// 	return applyDecorators(...decorators);
// }
