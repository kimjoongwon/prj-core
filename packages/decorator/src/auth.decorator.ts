import { Token } from "@cocrepo/constant";
import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiHeader, ApiSecurity } from "@nestjs/swagger";

/**
 * API 인증 문서화 (Cookie + OAuth2 병행)
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * Cookie 또는 OAuth2 Bearer Token으로 인증 가능함을 명시
 * X-Space-ID 헤더가 필요함을 명시 (SUPER_ADMIN이 아닌 경우 필수)
 *
 * @example
 * ⁣@Get('me')
 * ⁣@ApiAuth()
 * async getMe() { ... }
 */
export const ApiAuth = () =>
	applyDecorators(
		ApiCookieAuth(Token.ACCESS),
		ApiSecurity("oauth2", ["openid", "profile", "email", "roles"]),
		ApiHeader({
			name: "X-Space-ID",
			description:
				"Space ID (SUPER_ADMIN이 아닌 경우 필수, 없으면 모든 Space 데이터 조회)",
			required: false,
			schema: { type: "string", format: "uuid" },
		}),
	);
