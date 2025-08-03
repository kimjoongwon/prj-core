import {
	applyDecorators,
	SetMetadata,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RoleType } from "@shared/schema";
import { JwtAuthGuard } from "../guard";
import { AuthUserInterceptor } from "../interceptor";
import { PublicRoute } from "./public-route.decorator";
import { Roles } from "./roles.decorator";

export interface AuthOptions {
	roles?: RoleType[];
	public?: boolean;
	injectTenant?: boolean;
}

export const AUTH_OPTIONS_KEY = "authOptions";

export function Auth(options: AuthOptions = {}): MethodDecorator {
	const {
		roles = [],
		public: isPublicRoute = false,
		injectTenant = true, // 기본값: true (tenantId 자동 주입)
	} = options;

	const decorators = [
		SetMetadata(AUTH_OPTIONS_KEY, {
			roles,
			public: isPublicRoute,
			injectTenant,
		}),
		PublicRoute(isPublicRoute),
		ApiCookieAuth("accessToken"),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		Roles(roles),
	];

	if (!isPublicRoute) {
		decorators.push(UseGuards(JwtAuthGuard));
	}

	decorators.push(UseInterceptors(AuthUserInterceptor));

	return applyDecorators(...decorators);
}
