import { AuthApplicationService } from "@cocrepo/app";
import {
	AUTH_ERRORS,
	REQUEST_HEADER_KEYS,
	SYSTEM_ROLES,
	Token,
} from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	AuditLogStatsDto,
	AuthAuditLogDto,
	AuthSessionInfoDto,
	ChangePasswordDto,
	EmailVerificationRequestedDto,
	PageMetaDto,
	QueryAuthAuditLogDto,
	SetCurrentSpaceDto,
	SignUpPayloadDto,
	SpaceDto,
	TokenRefreshResponseDto,
	VerifyTokenResponseDto,
} from "@cocrepo/dto";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	Req,
	Res,
} from "@nestjs/common";
import {
	ApiBody,
	ApiCookieAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiSecurity,
	ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";

@ApiTags("AUTH")
@Controller()
export class AuthController {
	constructor(
		private readonly authApplicationService: AuthApplicationService,
	) {}

	@Public()
	@Get("login")
	@ApiOperation({
		operationId: "login",
		summary: "OIDC 로그인 리다이렉트",
		description:
			"지정한 OIDC clientId 기준으로 IDP Authorization 엔드포인트로 리다이렉트합니다. returnTo 파라미터로 인증 완료 후 복귀 경로를 지정할 수 있습니다.",
	})
	async login(
		@Query("clientId") clientId: string,
		@Query("returnTo") returnTo: string,
		@Res() res: Response,
	) {
		if (!clientId) {
			throw new BadRequestException("clientId 쿼리가 필요합니다");
		}

		const authorizationUrl =
			await this.authApplicationService.getAuthorizationUrl(returnTo, clientId);
		return res.redirect(authorizationUrl);
	}

	@Public()
	@Get("callback")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "oidcCallback",
		summary: "OIDC 콜백",
		description:
			"IDP에서 인증 완료 후 Authorization Code를 수신하여 토큰을 교환하고 등록된 기본 복귀 URL 또는 returnTo로 리다이렉트합니다.",
	})
	async handleCallback(
		@Query("clientId") clientId: string,
		@Query("code") code: string,
		@Query("state") state: string,
		@Query("error") error: string,
		@Query("error_description") errorDescription: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		if (!clientId) {
			throw new BadRequestException("clientId 쿼리가 필요합니다");
		}

		const { loginUrl } =
			await this.authApplicationService.getClientRedirects(clientId);

		if (error) {
			return res.redirect(
				this.buildLoginRedirectUrl(loginUrl, errorDescription || error),
			);
		}

		try {
			const callbackResult =
				await this.authApplicationService.handleOidcCallback(
					code,
					state,
					req,
					res,
				);
			return res.redirect(
				callbackResult.returnTo || callbackResult.defaultReturnTo,
			);
		} catch (_e) {
			return res.redirect(
				this.buildLoginRedirectUrl(loginUrl, AUTH_ERRORS.OIDC_CALLBACK_FAILED),
			);
		}
	}

	@Public()
	@Post("token/refresh")
	@ApiOperation({
		operationId: "refreshToken",
		summary: "토큰 재발급",
		description: "리프레시 토큰을 사용하여 IDP에서 새로운 토큰을 발급받습니다.",
	})
	@ApiErrors({ status: 401, message: AUTH_ERRORS.REFRESH_TOKEN_NOT_FOUND }, 500)
	@ApiResponseEntity(TokenRefreshResponseDto, HttpStatus.OK, {
		withSetCookie: true,
	})
	@ResponseMessage("토큰 재발급 성공")
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshToken = req.cookies.refreshToken;
		const sessionId = req.cookies?.sessionId;
		return this.authApplicationService.refreshTokenWithIdp(
			refreshToken,
			sessionId,
			res,
		);
	}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("sign-up")
	@ApiOperation({
		operationId: "signUp",
		summary: "회원가입",
		description:
			"이메일 인증 요청을 생성하고 인증 메일을 발송합니다. User는 인증 완료 시 생성됩니다.",
	})
	@ApiBody({
		type: SignUpPayloadDto,
		description: "회원가입 정보 (이메일, 비밀번호, 사용자명 등)",
	})
	@ApiErrors(
		{ status: 400, message: AUTH_ERRORS.INVALID_SIGNUP_FORMAT },
		{ status: 409, message: AUTH_ERRORS.EMAIL_ALREADY_EXISTS },
		500,
	)
	@ApiResponseEntity(EmailVerificationRequestedDto, HttpStatus.CREATED)
	@ResponseMessage("회원가입 성공")
	async signUp(@Body() signUpDto: SignUpPayloadDto) {
		return this.authApplicationService.signUp(signUpDto);
	}

	@Public()
	@Get("email-verifications/:token/confirm")
	@ApiOperation({
		operationId: "confirmEmailVerification",
		summary: "회원가입 이메일 인증 완료",
		description:
			"이메일 인증 토큰을 확인하고 회원가입을 완료한 뒤 Admin 로그인 화면으로 리다이렉트합니다.",
	})
	@ApiParam({ name: "token", type: String })
	@ApiErrors(400, 500)
	async confirmEmailVerification(
		@Param("token") token: string,
		@Res() res: Response,
	) {
		try {
			const redirectUrl =
				await this.authApplicationService.confirmEmailVerification(token);
			return res.redirect(redirectUrl);
		} catch (error) {
			const { loginUrl } =
				await this.authApplicationService.getClientRedirects("admin-web");
			const errorMessage =
				error instanceof Error ? error.message : "EMAIL_VERIFICATION_FAILED";
			return res.redirect(this.buildLoginRedirectUrl(loginUrl, errorMessage));
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiOperation({
		operationId: "verifyToken",
		summary: "토큰 유효성 검증",
		description: "현재 요청의 액세스 토큰이 유효한지 검증합니다.",
	})
	@ApiAuth()
	@SkipSpaceCheck()
	@ApiErrors({ status: 401, message: AUTH_ERRORS.TOKEN_INVALID })
	@ApiResponseEntity(VerifyTokenResponseDto, HttpStatus.OK)
	@ResponseMessage("토큰 유효성 검증 완료")
	async verifyToken() {
		return this.authApplicationService.verifyToken();
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("my-spaces")
	@ApiOperation({
		operationId: "getMySpaces",
		summary: "내 Space 목록 조회",
		description:
			"현재 인증된 사용자가 접근 가능한 Space 목록을 반환합니다. x-space-id 헤더 없이도 호출할 수 있습니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 Space 목록 조회 성공")
	async getMySpaces() {
		return this.authApplicationService.getMySpaces();
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("current-space")
	@ApiOperation({
		operationId: "getCurrentSpace",
		summary: "현재 선택 Space 조회",
		description:
			"요청의 x-space-id 헤더를 기준으로 Space를 반환합니다. 헤더가 없거나 유효하지 않으면 접근 가능한 기본 Space를 반환합니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("현재 Space 조회 성공")
	async getCurrentSpace(@Req() req: Request) {
		return this.authApplicationService.getCurrentSpace(
			this.readSpaceIdHeader(req),
		);
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("current-space")
	@ApiOperation({
		operationId: "setCurrentSpace",
		summary: "현재 선택 Space 변경",
		description:
			"사용자가 접근 가능한 Space 중 하나를 선택 가능 대상으로 검증하고 반환합니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiBody({
		type: SetCurrentSpaceDto,
		description: "현재 선택할 Space ID",
	})
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("현재 Space 변경 성공")
	async setCurrentSpace(@Body() dto: SetCurrentSpaceDto) {
		return this.authApplicationService.setCurrentSpace(dto);
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
	@ResponseMessage("로그아웃 성공")
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const accessToken = req.cookies?.accessToken;
		const sessionId = req.cookies?.sessionId;
		return this.authApplicationService.logoutWithCookie(
			accessToken,
			sessionId,
			res,
		);
	}

	@HttpCode(HttpStatus.OK)
	@Get("audit-logs")
	@ApiOperation({
		operationId: "getAuthAuditLogs",
		summary: "인증 감사 로그 조회",
		description:
			"로그인 시도에 대한 감사 로그를 현재 선택 tenant scope 기준으로 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(AuthAuditLogDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("감사 로그 조회 성공")
	async getAuthAuditLogs(@Query() query: QueryAuthAuditLogDto) {
		return this.authApplicationService.getAuthAuditLogs(query);
	}

	@HttpCode(HttpStatus.OK)
	@Get("audit-logs/stats")
	@ApiOperation({
		operationId: "getAuthAuditLogStats",
		summary: "감사 로그 통계 조회",
		description: "오늘의 로그인 성공/실패/잠금 건수와 전체 건수를 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(AuditLogStatsDto, HttpStatus.OK)
	@ResponseMessage("감사 로그 통계 조회 성공")
	async getAuthAuditLogStats() {
		return this.authApplicationService.getAuthAuditLogStats();
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("change-password")
	@ApiOperation({
		operationId: "changePassword",
		summary: "비밀번호 변경",
		description:
			"현재 비밀번호를 확인 후 새 비밀번호로 변경합니다. 비밀번호 정책 검증 및 재사용 방지가 적용됩니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 400, message: "CURRENT_PASSWORD_INCORRECT" },
		{ status: 400, message: "PASSWORD_POLICY_VIOLATION" },
		{ status: 400, message: "PASSWORD_REUSE" },
		{ status: 400, message: "PASSWORD_MISMATCH" },
		401,
	)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("비밀번호가 변경되었습니다.")
	async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
		if (dto.newPassword !== dto.confirmPassword) {
			throw new BadRequestException("PASSWORD_MISMATCH");
		}

		return this.authApplicationService.changePassword({
			currentPassword: dto.currentPassword,
			newPassword: dto.newPassword,
			logoutOtherDevices: dto.logoutOtherDevices,
			currentSessionId: req.cookies?.sessionId,
		});
	}

	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/unlock")
	@ApiOperation({
		operationId: "unlockAccount",
		summary: "계정 잠금 해제",
		description: "잠긴 계정을 해제합니다. FULL_ACCESS 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("계정 잠금이 해제되었습니다.")
	async unlockAccount(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.authApplicationService.unlockAccount(userId);
	}

	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/force-reset-password")
	@ApiOperation({
		operationId: "forceResetPassword",
		summary: "비밀번호 강제 재설정",
		description:
			"임시 비밀번호를 생성하여 이메일로 발송합니다. FULL_ACCESS 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("임시 비밀번호가 이메일로 발송되었습니다.")
	async forceResetPassword(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.authApplicationService.forceResetPassword(userId);
	}

	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/invalidate-sessions")
	@ApiOperation({
		operationId: "invalidateUserSessions",
		summary: "사용자 전체 세션 무효화",
		description:
			"특정 사용자의 모든 세션을 강제 종료합니다. FULL_ACCESS 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("사용자의 모든 세션이 무효화되었습니다.")
	async invalidateUserSessions(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.authApplicationService.invalidateUserSessions(userId);
	}

	// =========================================================================
	// 세션 관리 (Self-Service)
	// =========================================================================

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("my-sessions")
	@ApiOperation({
		operationId: "getMySessions",
		summary: "내 활성 세션 목록",
		description:
			"현재 인증된 사용자의 모든 활성 세션 목록을 반환합니다. 현재 세션에 isCurrent=true가 표시됩니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(AuthSessionInfoDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("세션 목록 조회 성공")
	async getMySessions(@Req() req: Request) {
		const currentSessionId = req.cookies?.sessionId;
		return this.authApplicationService.getMySessions(currentSessionId);
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("my-sessions/:sessionId/revoke")
	@ApiOperation({
		operationId: "revokeSession",
		summary: "특정 세션 종료",
		description:
			"지정된 세션을 종료합니다. 다른 기기의 세션을 종료할 때 사용합니다.",
	})
	@ApiParam({ name: "sessionId", type: String })
	@ApiAuth()
	@ApiErrors(401, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("세션이 종료되었습니다.")
	async revokeSession(@Param("sessionId") sessionId: string) {
		return this.authApplicationService.revokeSession(sessionId);
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("my-sessions/revoke-others")
	@ApiOperation({
		operationId: "revokeOtherSessions",
		summary: "다른 모든 세션 종료",
		description: "현재 세션을 제외한 다른 모든 세션을 종료합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("다른 모든 세션이 종료되었습니다.")
	async revokeOtherSessions(@Req() req: Request) {
		const currentSessionId = req.cookies?.sessionId;
		if (!currentSessionId) {
			throw new BadRequestException("세션 ID가 없습니다");
		}
		await this.authApplicationService.revokeOtherSessions(currentSessionId);
		return true;
	}

	private buildLoginRedirectUrl(
		loginUrl: string,
		errorMessage: string,
	): string {
		try {
			const url = new URL(loginUrl);
			url.searchParams.set("error", errorMessage);
			return url.toString();
		} catch {
			const joiner = loginUrl.includes("?") ? "&" : "?";
			return `${loginUrl}${joiner}error=${encodeURIComponent(errorMessage)}`;
		}
	}

	private readSpaceIdHeader(req: Request): string | undefined {
		const headerValue = req.headers[REQUEST_HEADER_KEYS.SPACE_ID];
		if (typeof headerValue === "string") {
			return headerValue;
		}

		return Array.isArray(headerValue) ? headerValue[0] : undefined;
	}
}
