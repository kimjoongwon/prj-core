import { REQUEST_HEADER_KEYS, Token } from "@cocrepo/constant";
import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiHeader, ApiSecurity } from "@nestjs/swagger";

interface ApiAuthOptions {
	/** Swagger에 x-tenant-id header를 표시할지 여부 */
	tenantHeader?: boolean;
}

interface ApiTenantHeaderOptions {
	required?: boolean;
	description?: string;
}

/** Swagger에 현재 요청 Tenant header를 문서화합니다. */
export const ApiTenantHeader = (options: ApiTenantHeaderOptions = {}) =>
	ApiHeader({
		name: REQUEST_HEADER_KEYS.TENANT_ID,
		required: options.required ?? true,
		description:
			options.description ??
			"현재 요청에서 사용할 Tenant ID입니다. 서버는 이 Tenant에서 Space를 파생하고 Space category scope로 리소스를 필터링합니다.",
		schema: {
			type: "string",
			format: "uuid",
			example: "123e4567-e89b-12d3-a456-426614174000",
		},
	});

/**
 * API 인증 문서화 (Cookie + OAuth2 병행)
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * Cookie 또는 OAuth2 Bearer Token으로 인증 가능함을 명시
 * 현재 Space는 별도의 `x-tenant-id` 헤더에서 Tenant를 고른 뒤 파생됩니다.
 *
 * @example
 * ⁣@Get('me')
 * ⁣@ApiAuth()
 * async getMe() { ... }
 */
export const ApiAuth = (options: ApiAuthOptions = {}) => {
	const decorators = [
		ApiCookieAuth(Token.ACCESS),
		ApiSecurity("oauth2", ["openid", "profile", "email", "roles"]),
	];

	if (options.tenantHeader !== false) {
		decorators.push(ApiTenantHeader());
	}

	return applyDecorators(...decorators);
};
