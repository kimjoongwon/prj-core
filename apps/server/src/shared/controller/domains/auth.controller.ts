import { ApiResponseEntity, Public } from "@cocrepo/decorator";
import {
	LoginPayloadDto,
	SignUpPayloadDto,
	TokenDto,
	UserDto,
} from "@cocrepo/dto";
import { User } from "@cocrepo/entity";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { ApiAuth, ApiErrors, ResponseMessage } from "../../decorator";
import { AuthFacade } from "../../service/facade/auth.facade";
import { ContextService, TokenService } from "../../service/utils";

/**
 * 인증 관련 에러 메시지 상수
 * @description 코드와 API 문서화의 일관성을 위해 단일 진실 공급원으로 관리
 */
const AuthErrorMessages = {
	// 로그인
	INVALID_EMAIL_OR_PASSWORD_FORMAT:
		"이메일 또는 비밀번호 형식이 올바르지 않습니다",
	INVALID_CREDENTIALS: "이메일 또는 비밀번호가 일치하지 않습니다",

	// 토큰 관련
	REFRESH_TOKEN_NOT_FOUND: "리프레시 토큰이 존재하지 않습니다",
	REFRESH_TOKEN_EXPIRED: "리프레시 토큰이 만료되었습니다",
	TOKEN_INVALID: "토큰이 유효하지 않습니다",
	TOKEN_NOT_FOUND: "토큰이 존재하지 않습니다",

	// 사용자
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",

	// 회원가입
	INVALID_SIGNUP_FORMAT: "입력 형식이 올바르지 않습니다",
	EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",
} as const;

@ApiTags("AUTH")
@Controller()
export class AuthController {
	constructor(
		private readonly authFacade: AuthFacade,
		private readonly tokenService: TokenService,
		private readonly contextService: ContextService,
	) {}

	@Public()
	@Post("login")
	@ApiOperation({
		summary: "사용자 로그인",
		description: "이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.",
	})
	@ApiBody({
		type: LoginPayloadDto,
		description: "로그인 정보 (이메일, 비밀번호)",
	})
	@ApiErrors(
		{
			status: 400,
			message: AuthErrorMessages.INVALID_EMAIL_OR_PASSWORD_FORMAT,
		},
		{ status: 401, message: AuthErrorMessages.INVALID_CREDENTIALS },
		500,
	)
	@ApiResponseEntity(TokenDto, HttpStatus.OK, { withSetCookie: true })
	@ResponseMessage("로그인 성공")
	async login(
		@Body() loginDto: LoginPayloadDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, refreshToken, user } =
			await this.authFacade.login(loginDto);
		const mainTenantId = user.tenants?.find((tenant) => tenant.main)?.id ?? "";

		this.tokenService.setAccessTokenCookie(res, accessToken);
		this.tokenService.setRefreshTokenCookie(res, refreshToken);

		return plainToInstance(TokenDto, {
			accessToken,
			refreshToken,
			user: plainToInstance(UserDto, user),
			mainTenantId,
		});
	}

	@Public()
	@Post("token/refresh")
	@ApiOperation({
		summary: "토큰 재발급",
		description:
			"리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급받습니다.",
	})
	@ApiErrors(
		{ status: 401, message: AuthErrorMessages.REFRESH_TOKEN_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(TokenDto, HttpStatus.OK, { withSetCookie: true })
	@ResponseMessage("토큰 재발급 성공")
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<TokenDto> {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException(
				AuthErrorMessages.REFRESH_TOKEN_NOT_FOUND,
			);
		}

		const { newAccessToken, newRefreshToken } =
			await this.authFacade.getNewToken(refreshToken);

		this.tokenService.setAccessTokenCookie(res, newAccessToken);
		this.tokenService.setRefreshTokenCookie(res, newRefreshToken);

		const user = await this.authFacade.getCurrentUser(newAccessToken);

		if (!user) {
			throw new UnauthorizedException(AuthErrorMessages.USER_NOT_FOUND);
		}

		const mainTenantId = user.tenants?.find((tenant) => tenant.main)?.id ?? "";

		return plainToInstance(TokenDto, {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			user: plainToInstance(UserDto, user),
			mainTenantId,
		});
	}

	@Get("new-token")
	@ApiOperation({
		summary: "인증된 사용자 토큰 갱신",
		description:
			"인증된 사용자의 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: AuthErrorMessages.TOKEN_INVALID }, 500)
	@ApiResponseEntity(TokenDto, HttpStatus.OK, { withSetCookie: true })
	@ResponseMessage("토큰 갱신 성공")
	async getNewToken(
		@Req() req: Request & { user: User },
		@Res({ passthrough: true }) res: Response,
	): Promise<TokenDto> {
		const refreshToken = req.cookies.refreshToken;
		const { newAccessToken, newRefreshToken } =
			await this.authFacade.getNewToken(refreshToken);

		const user = req.user;

		const tenant = user.tenants?.find((tenant) => tenant.main);

		this.tokenService.setAccessTokenCookie(res, newAccessToken);
		this.tokenService.setRefreshTokenCookie(res, newRefreshToken);
		res.cookie("mainTenantId", tenant?.id);

		return plainToInstance(TokenDto, {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			mainTenantId: tenant?.id || "",
			user: plainToInstance(UserDto, user),
		});
	}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("sign-up")
	@ApiOperation({
		summary: "회원가입",
		description: "새로운 사용자 계정을 생성하고 JWT 토큰을 발급받습니다.",
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
	@ApiResponseEntity(TokenDto, HttpStatus.CREATED)
	@ResponseMessage("회원가입 성공")
	async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
		return this.authFacade.signUp(signUpDto);
	}

	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiOperation({
		summary: "토큰 유효성 검증",
		description: "현재 요청의 액세스 토큰이 유효한지 검증합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: AuthErrorMessages.TOKEN_INVALID })
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("토큰 유효성 검증 완료")
	async verifyToken() {
		const token = this.contextService.getToken();
		if (!token) {
			throw new UnauthorizedException(AuthErrorMessages.TOKEN_NOT_FOUND);
		}

		const isValid = this.tokenService.verifyToken(token);
		return isValid;
	}

	@HttpCode(HttpStatus.OK)
	@Post("logout")
	@ApiOperation({
		summary: "로그아웃",
		description:
			"현재 사용자를 로그아웃하고 모든 인증 쿠키를 삭제하고 토큰을 무효화합니다.",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description:
			"로그아웃 성공 시 모든 인증 관련 쿠키가 삭제되고 토큰이 무효화됩니다.",
		headers: {
			"Set-Cookie": {
				description:
					"accessToken, refreshToken, tenantId, workspaceId 쿠키가 삭제됩니다.",
				schema: {
					type: "string",
					example:
						"accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
				},
			},
		},
	})
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("로그아웃 성공")
	async logout(
		@Req() req: Request & { user?: User },
		@Res({ passthrough: true }) res: Response,
	) {
		// Redis에서 토큰 무효화
		const userId = req.user?.id;
		const accessToken = req.cookies?.accessToken;

		if (userId) {
			await this.authFacade.logout(userId, accessToken);
		}

		// HttpOnly 쿠키들을 삭제 (동일한 옵션으로 삭제해야 함)
		this.tokenService.clearTokenCookies(res);
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId");

		return true;
	}
}
