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
import { ApiTags } from "@nestjs/swagger";
import {
	ApiResponseEntity,
	LoginPayloadDto,
	Public,
	SignUpPayloadDto,
	TokenDto,
	UserDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { ResponseMessage } from "../../decorator";
import { ContextService } from "../../service/context.service";
import { AuthService } from "../../service/domains/auth.service";
import { TokenService } from "../../service/domains/token.service";

@ApiTags("AUTH")
@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService,
		private readonly contextService: ContextService,
	) {}

	@Public()
	@ApiResponseEntity(TokenDto, HttpStatus.OK)
	@ResponseMessage("로그인 성공")
	@Post("login")
	async login(
		@Body() loginDto: LoginPayloadDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, refreshToken, user } =
			await this.authService.login(loginDto);
		const mainTenantId = user.tenants?.find((tenant) => tenant.main)?.id ?? "";

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
		});
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
		});

		return plainToInstance(TokenDto, {
			accessToken,
			refreshToken,
			user: plainToInstance(UserDto, user),
			mainTenantId,
		});
	}

	@Public()
	@ApiResponseEntity(TokenDto, HttpStatus.OK)
	@ResponseMessage("토큰 재발급 성공")
	@Post("token/refresh")
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<TokenDto> {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다.");
		}

		const { newAccessToken, newRefreshToken } =
			await this.authService.getNewToken(refreshToken);

		res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
		res.cookie("accessToken", newAccessToken, { httpOnly: true });

		const user = await this.authService.getCurrentUser(newAccessToken);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		const mainTenantId = user.tenants?.find((tenant) => tenant.main)?.id ?? "";

		return plainToInstance(TokenDto, {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			user: plainToInstance(UserDto, user),
			mainTenantId,
		});
	}

	@ApiResponseEntity(TokenDto, HttpStatus.OK)
	@ResponseMessage("토큰 갱신 성공")
	@Get("new-token")
	async getNewToken(
		@Req() req: Request & { user: UserDto },
		@Res({ passthrough: true }) res: Response,
	): Promise<TokenDto> {
		const refreshToken = req.cookies.refreshToken;
		const { newAccessToken, newRefreshToken } =
			await this.authService.getNewToken(refreshToken);

		const user = req.user;

		const tenant = user.tenants?.find((tenant) => tenant.main);

		res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
		res.cookie("accessToken", newAccessToken, { httpOnly: true });
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
	@ApiResponseEntity(TokenDto, HttpStatus.CREATED)
	@ResponseMessage("회원가입 성공")
	async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
		return this.authService.signUp(signUpDto);
	}

	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("토큰 유효성 검증 완료")
	async verifyToken() {
		const token = this.contextService.getToken();
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}

		const isValid = this.tokenService.verifyToken(token);
		return isValid;
	}

	@HttpCode(HttpStatus.OK)
	@Post("logout")
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	@ResponseMessage("로그아웃 성공")
	async logout(@Res({ passthrough: true }) res: Response) {
		// HttpOnly 쿠키들을 삭제
		res.clearCookie("accessToken", { httpOnly: true });
		res.clearCookie("refreshToken", { httpOnly: true });
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId", { httpOnly: true });

		return true;
	}
}
