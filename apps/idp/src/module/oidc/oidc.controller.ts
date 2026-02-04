import { All, Controller, Req, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { OidcProviderService } from "./oidc-provider.service";

/**
 * OIDC Controller
 *
 * oidc-provider 라이브러리의 모든 요청을 NestJS로 라우팅합니다.
 * OIDC 표준 엔드포인트는 /.well-known/openid-configuration에서 확인할 수 있습니다.
 *
 * ## 제공되는 엔드포인트
 * | 경로 | 설명 |
 * |------|------|
 * | GET/POST /oidc/auth | Authorization 엔드포인트 |
 * | POST /oidc/token | Token 엔드포인트 |
 * | GET /oidc/me | UserInfo 엔드포인트 |
 * | GET /oidc/jwks | JWKS (JSON Web Key Set) |
 * | GET /oidc/.well-known/openid-configuration | OIDC Discovery |
 * | POST /oidc/token/introspection | Token Introspection |
 * | POST /oidc/token/revocation | Token Revocation |
 * | GET/POST /oidc/session/end | End Session (로그아웃) |
 *
 * ## 지원 Scope
 * - `openid` - 기본 인증
 * - `profile` - 이름, 수정일
 * - `email` - 이메일 주소
 * - `phone` - 전화번호
 * - `roles` - 사용자 역할 목록 (커스텀)
 * - `permissions` - CASL 권한 목록 (커스텀)
 */
@ApiExcludeController()
@Controller("oidc")
export class OidcController {
	constructor(private readonly oidcProviderService: OidcProviderService) {}

	/**
	 * 모든 OIDC 엔드포인트를 oidc-provider에 위임
	 */
	@All("*path")
	async handleOidc(
		@Req() req: Request,
		@Res() res: Response,
	): Promise<void> {
		const provider = this.oidcProviderService.getProvider();
		const callback = provider.callback();

		// oidc-provider는 Koa 기반이므로 Express 요청을 변환
		// path를 /oidc prefix 없이 전달
		req.url = req.url.replace(/^\/oidc/, "") || "/";

		// callback은 (req, res) 형태의 http request handler
		return callback(req, res);
	}
}
