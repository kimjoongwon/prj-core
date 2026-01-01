import { Token } from "@cocrepo/constant";
import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiHeader } from "@nestjs/swagger";

/**
 * Access Token 쿠키 인증 문서화
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * JWT Access Token이 쿠키로 전송되어야 함을 명시
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
		ApiHeader({
			name: "X-Space-ID",
			description:
				"Space ID (SUPER_ADMIN이 아닌 경우 필수, 없으면 모든 Space 데이터 조회)",
			required: false,
			schema: { type: "string", format: "uuid" },
		}),
	);
