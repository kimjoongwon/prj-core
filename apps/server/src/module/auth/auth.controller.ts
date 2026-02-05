import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	SignUpPayloadDto,
	TokenRefreshResponseDto,
	VerifyTokenResponseDto,
} from "@cocrepo/dto";
import { AuthFacade } from "@cocrepo/facade";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

/**
 * 인증 관련 에러 메시지 상수
 */
const AuthErrorMessages = {
	// 토큰 관련
	REFRESH_TOKEN_NOT_FOUND: "리프레시 토큰이 존재하지 않습니다",
	TOKEN_INVALID: "토큰이 유효하지 않습니다",

	// 사용자
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",

	// 회원가입
	INVALID_SIGNUP_FORMAT: "입력 형식이 올바르지 않습니다",
	EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",

	// OIDC
	OIDC_CALLBACK_FAILED: "OIDC 인증 콜백 처리에 실패했습니다",
	OIDC_STATE_MISMATCH: "OIDC state 검증에 실패했습니다",
} as const;

@ApiTags("AUTH")
@Controller()
export class AuthController {
	constructor(
		private readonly authFacade: AuthFacade,
		private readonly configService: ConfigService,
	) {}

	@Public()
	@Get("login")
	@ApiOperation({
		operationId: "login",
		summary: "OIDC 로그인 리다이렉트",
		description: "IDP의 OIDC Authorization 엔드포인트로 리다이렉트합니다.",
	})
	async login(@Res() res: Response) {
		const authorizationUrl = await this.authFacade.getAuthorizationUrl();
		return res.redirect(authorizationUrl);
	}

	@Public()
	@Get("callback")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "oidcCallback",
		summary: "OIDC 콜백",
		description:
			"IDP에서 인증 완료 후 Authorization Code를 수신하여 토큰을 교환하고 대시보드로 리다이렉트합니다.",
	})
	async handleCallback(
		@Query("code") code: string,
		@Query("state") state: string,
		@Query("error") error: string,
		@Query("error_description") errorDescription: string,
		@Res() res: Response,
	) {
		const frontendUrl = this.configService.get("app.frontendDomain") || "http://localhost:3000";

		// OIDC 에러 처리 (IDP에서 에러 반환 시)
		if (error) {
			const loginUrl = `${frontendUrl}/admin/auth/login?error=${encodeURIComponent(errorDescription || error)}`;
			return res.redirect(loginUrl);
		}

		try {
			await this.authFacade.handleOidcCallback(code, state, res);
			return res.redirect(`${frontendUrl}/admin/dashboard`);
		} catch (_e) {
			const loginUrl = `${frontendUrl}/admin/auth/login?error=${encodeURIComponent(AuthErrorMessages.OIDC_CALLBACK_FAILED)}`;
			return res.redirect(loginUrl);
		}
	}

	@Public()
	@Post("token/refresh")
	@ApiOperation({
		operationId: "refreshToken",
		summary: "토큰 재발급",
		description:
			"리프레시 토큰을 사용하여 IDP에서 새로운 토큰을 발급받습니다.",
	})
	@ApiErrors(
		{ status: 401, message: AuthErrorMessages.REFRESH_TOKEN_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(TokenRefreshResponseDto, HttpStatus.OK, {
		withSetCookie: true,
	})
	@ResponseMessage("common.auth.refresh.success")
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshToken = req.cookies.refreshToken;
		return this.authFacade.refreshTokenWithIdp(refreshToken, res);
	}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("sign-up")
	@ApiOperation({
		operationId: "signUp",
		summary: "회원가입",
		description: "새로운 사용자 계정을 생성합니다.",
	})
	@ApiBody({
		type: SignUpPayloadDto,
		description: "회원가입 정보 (이메일, 비밀번호, 사용자명 등)",
	})
	@ApiErrors(
		{ status: 400, message: AuthErrorMessages.INVALID_SIGNUP_FORMAT },
		{ status: 409, message: AuthErrorMessages.EMAIL_ALREADY_EXISTS },
		500,
	)
	@ResponseMessage("common.auth.register.success")
	async signUp(@Body() signUpDto: SignUpPayloadDto) {
		return this.authFacade.signUp(signUpDto);
	}

	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiOperation({
		operationId: "verifyToken",
		summary: "토큰 유효성 검증",
		description: "현재 요청의 액세스 토큰이 유효한지 검증합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: AuthErrorMessages.TOKEN_INVALID })
	@ApiResponseEntity(VerifyTokenResponseDto, HttpStatus.OK)
	@ResponseMessage("common.auth.validate.success")
	async verifyToken() {
		return this.authFacade.verifyToken();
	}

	@HttpCode(HttpStatus.OK)
	@Post("logout")
	@ApiOperation({
		operationId: "logout",
		summary: "로그아웃",
		description:
			"현재 사용자를 로그아웃하고 IDP 토큰을 무효화하며 쿠키를 삭제합니다.",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description:
			"로그아웃 성공 시 모든 인증 관련 쿠키가 삭제되고 토큰이 무효화됩니다.",
	})
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("common.auth.logout.success")
	async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const accessToken = req.cookies?.accessToken;
		return this.authFacade.logoutWithCookie(accessToken, res);
	}
}
