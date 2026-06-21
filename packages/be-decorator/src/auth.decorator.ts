import { Token } from "@cocrepo/constant";
import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiSecurity } from "@nestjs/swagger";

/**
 * API 인증 문서화 (Cookie + OAuth2 병행)
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * Cookie 또는 OAuth2 Bearer Token으로 인증 가능함을 명시
 * 현재 Space는 별도의 `x-tenant-id` 헤더로 결정됩니다.
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
	);
