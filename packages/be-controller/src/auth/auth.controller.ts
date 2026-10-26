import { ParseBigIntIdPipe } from "@cocrepo/be-common";
import {
	ConfirmEmailVerificationCommand,
	ForceResetPasswordCommand,
	GetAuthAuditLogStatsQuery,
	GetAuthAuditLogsQuery,
	GetAuthLoginRedirectCommand,
	GetCurrentSpaceQuery,
	GetMySpacesQuery,
	GetSignUpSpacesQuery,
	HandleOidcCallbackCommand,
	InvalidateUserSessionsCommand,
	LogoutWithCookieCommand,
	RefreshTokenWithIdpCommand,
	SetCurrentSpaceCommand,
	SignUpCommand,
	UnlockAccountCommand,
	VerifyTokenQuery,
} from "@cocrepo/command";
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
	ApiTenantHeader,
	Public,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	AuditLogStatsDto,
	AuthAuditLogDto,
	EmailVerificationRequestedDto,
	LogoutResponseDto,
	PageMetaDto,
	QueryAuthAuditLogDto,
	SetCurrentSpaceDto,
	SignUpPayloadDto,
	SpaceDto,
	TokenRefreshResponseDto,
	VerifyTokenResponseDto,
} from "@cocrepo/dto";
import { formatDatabaseId } from "@cocrepo/type";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
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
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Public()
	@Get("oidc/login")
	@ApiOperation({
		operationId: "login",
		summary: "OIDC 로그인 리다이렉트",
		description:
			"지정한 OIDC clientId 기준으로 IDP Authorization 엔드포인트로 리다이렉트합니다. returnTo 파라미터로 인증 완료 후 복귀 경로를 지정할 수 있습니다.",
	})
	async login(
		@Query("clientId") clientId: string,
		@Query("returnTo") returnTo: string,
		@Query("prompt") prompt: string,
		@Res() res: Response,
	) {
		if (!clientId) {
			throw new BadRequestException("clientId 쿼리가 필요합니다");
		}

		const authorizationUrl = await this.commandBus.execute(
			new GetAuthLoginRedirectCommand(returnTo, clientId, prompt),
		);
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

		const result = await this.commandBus.execute(
			new HandleOidcCallbackCommand(
				clientId,
				code,
				state,
				error,
				errorDescription,
				req,
				res,
			),
		);

		if (result.kind === "redirect") {
			return res.redirect(result.url);
		}

		return res.status(result.statusCode).send(result.body);
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
		@Headers(REQUEST_HEADER_KEYS.REFRESH_TOKEN) refreshTokenHeader?: string,
	) {
		const sessionId = req.cookies?.sessionId;
		return this.commandBus.execute(
			new RefreshTokenWithIdpCommand(
				req.cookies?.refreshToken,
				refreshTokenHeader,
				sessionId,
				res,
			),
		);
	}

	@Public()
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("sign-up/spaces")
	@ApiOperation({
		operationId: "getSignUpSpaces",
		summary: "회원가입 Space 목록 조회",
		description:
			"회원가입 전 사용자가 선택할 수 있는 Space 목록을 반환합니다. x-tenant-id 헤더 없이 호출할 수 있습니다.",
	})
	@ApiErrors(500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("회원가입 Space 목록 조회 성공")
	async getSignUpSpaces() {
		return this.queryBus.execute(new GetSignUpSpacesQuery());
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
	@ApiTenantHeader({
		required: false,
		description: "회원가입 시 선택한 Space의 숫자 ID 문자열입니다.",
	})
	@ApiErrors(
		{ status: 400, message: AUTH_ERRORS.INVALID_SIGNUP_FORMAT },
		{ status: 409, message: AUTH_ERRORS.EMAIL_ALREADY_EXISTS },
		500,
	)
	@ApiResponseEntity(EmailVerificationRequestedDto, HttpStatus.CREATED)
	@ResponseMessage("회원가입 성공")
	async signUp(
		@Body() signUpDto: SignUpPayloadDto,
		@Headers(REQUEST_HEADER_KEYS.TENANT_ID) requestedSpaceId?: string,
	) {
		if (
			requestedSpaceId &&
			requestedSpaceId !== formatDatabaseId(signUpDto.spaceId)
		) {
			throw new BadRequestException("SIGN_UP_SPACE_HEADER_MISMATCH");
		}

		return this.commandBus.execute(new SignUpCommand(signUpDto));
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
		const redirectUrl = await this.commandBus.execute(
			new ConfirmEmailVerificationCommand(token),
		);
		return res.redirect(redirectUrl);
	}

	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiOperation({
		operationId: "verifyToken",
		summary: "토큰 유효성 검증",
		description: "현재 요청의 액세스 토큰이 유효한지 검증합니다.",
	})
	@ApiAuth({ tenantHeader: false })
	@SkipSpaceCheck()
	@ApiErrors({ status: 401, message: AUTH_ERRORS.TOKEN_INVALID })
	@ApiResponseEntity(VerifyTokenResponseDto, HttpStatus.OK)
	@ResponseMessage("토큰 유효성 검증 완료")
	async verifyToken() {
		return this.queryBus.execute(new VerifyTokenQuery());
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("my-spaces")
	@ApiOperation({
		operationId: "getMySpaces",
		summary: "내 Space 목록 조회",
		description:
			"현재 인증된 사용자가 접근 가능한 Space 목록을 반환합니다. x-tenant-id 헤더 없이도 호출할 수 있습니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 Space 목록 조회 성공")
	async getMySpaces() {
		return this.queryBus.execute(new GetMySpacesQuery());
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Get("current-space")
	@ApiOperation({
		operationId: "getCurrentSpace",
		summary: "현재 선택 Space 조회",
		description:
			"인증 사용자의 저장된 currentTenantId를 기준으로 현재 Space를 반환합니다. 저장값이 없거나 유효하지 않으면 null을 반환합니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiErrors(401, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("현재 Space 조회 성공")
	async getCurrentSpace() {
		return this.queryBus.execute(new GetCurrentSpaceQuery());
	}

	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("current-space")
	@ApiOperation({
		operationId: "setCurrentSpace",
		summary: "현재 선택 Tenant 변경",
		description:
			"사용자가 접근 가능한 Tenant 중 하나를 선택 가능 대상으로 검증하고 Space 정보를 반환합니다.",
	})
	@ApiCookieAuth(Token.ACCESS)
	@ApiSecurity("oauth2", ["openid", "profile", "email", "roles"])
	@ApiBody({
		type: SetCurrentSpaceDto,
		description: "현재 선택할 Tenant ID",
	})
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(SpaceDto, HttpStatus.OK)
	@ResponseMessage("현재 Tenant 변경 성공")
	async setCurrentSpace(@Body() dto: SetCurrentSpaceDto) {
		return this.commandBus.execute(new SetCurrentSpaceCommand(dto));
	}

	@HttpCode(HttpStatus.OK)
	@Post("logout")
	@Public()
	@ApiOperation({
		operationId: "logout",
		summary: "로그아웃",
		description:
			"현재 사용자를 로그아웃하고 IDP 토큰을 무효화하며 RP 쿠키를 삭제합니다. 응답의 endSessionUrl은 OIDC RP-Initiated Logout(end_session) URL로, 브라우저가 이 URL로 이동하면 OP가 자기 세션을 정리합니다.",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description:
			"로그아웃 성공 시 인증 관련 RP 쿠키가 삭제되고 토큰이 무효화됩니다.",
	})
	@ApiResponseEntity(LogoutResponseDto, HttpStatus.OK)
	@ResponseMessage("로그아웃 성공")
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const sessionId = req.cookies?.sessionId;
		return this.commandBus.execute(
			new LogoutWithCookieCommand(
				req.cookies?.accessToken,
				req.headers.authorization,
				sessionId,
				res,
			),
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
		return this.queryBus.execute(new GetAuthAuditLogsQuery(query));
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
		return this.queryBus.execute(new GetAuthAuditLogStatsQuery());
	}

	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/unlock")
	@ApiOperation({
		operationId: "unlockAccount",
		summary: "계정 잠금 해제",
		description: "잠긴 계정을 해제합니다. PLATFORM_ADMIN 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("계정 잠금이 해제되었습니다.")
	async unlockAccount(@Param("userId", ParseBigIntIdPipe) userId: bigint) {
		return this.commandBus.execute(new UnlockAccountCommand(userId));
	}

	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/force-reset-password")
	@ApiOperation({
		operationId: "forceResetPassword",
		summary: "비밀번호 강제 재설정",
		description:
			"임시 비밀번호를 생성하여 이메일로 발송합니다. PLATFORM_ADMIN 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("임시 비밀번호가 이메일로 발송되었습니다.")
	async forceResetPassword(@Param("userId", ParseBigIntIdPipe) userId: bigint) {
		return this.commandBus.execute(new ForceResetPasswordCommand(userId));
	}

	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@SkipSpaceCheck()
	@HttpCode(HttpStatus.OK)
	@Post("users/:userId/invalidate-sessions")
	@ApiOperation({
		operationId: "invalidateUserSessions",
		summary: "사용자 전체 세션 무효화",
		description:
			"특정 사용자의 모든 세션을 강제 종료합니다. PLATFORM_ADMIN 권한이 필요합니다.",
	})
	@ApiParam({ name: "userId", type: String })
	@ApiAuth()
	@ApiErrors(401, 403, 404)
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("사용자의 모든 세션이 무효화되었습니다.")
	async invalidateUserSessions(
		@Param("userId", ParseBigIntIdPipe) userId: bigint,
	) {
		return this.commandBus.execute(new InvalidateUserSessionsCommand(userId));
	}
}
