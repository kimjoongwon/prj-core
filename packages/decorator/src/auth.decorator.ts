import { Token } from "@cocrepo/constant";
import { ApiCookieAuth } from "@nestjs/swagger";

/**
 * Access Token 쿠키 인증 문서화
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * JWT Access Token이 쿠키로 전송되어야 함을 명시
 *
 * @example
 * ⁣@Get('me')
 * ⁣@ApiAuth()
 * async getMe() { ... }
 */
export const ApiAuth = () => ApiCookieAuth(Token.ACCESS);
