import { HandleOidcCommand } from "@cocrepo/command";
import { Public } from "@cocrepo/decorator";
import { All, Controller, Req, Res } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiExcludeController } from "@nestjs/swagger";
import type { Request, Response } from "express";

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
 */
@Public()
@ApiExcludeController()
@Controller("oidc")
export class OidcController {
	constructor(private readonly commandBus: CommandBus) {}

	/**
	 * 모든 OIDC 엔드포인트를 oidc-provider에 위임
	 */
	@All("*path")
	async handleOidc(@Req() req: Request, @Res() res: Response): Promise<void> {
		return this.commandBus.execute(new HandleOidcCommand(req, res));
	}
}
