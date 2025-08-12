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
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
	LoginPayloadDto,
	ResponseEntity,
	SignUpPayloadDto,
	TokenDto,
	UserDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { Auth, Public } from "../../decorator";
import { ApiResponseEntity } from "../../decorator/api-response-entity.decorator";
import { ContextProvider } from "../../provider";
import { AuthService } from "../../service/domain/auth.service";
import { TokenService } from "../../service/domain/token.service";

@ApiTags("AUTH")
@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService,
	) {}

	@ApiResponseEntity(TokenDto, HttpStatus.OK)
	@Post("login")
	async login(
		@Body() loginDto: LoginPayloadDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, refreshToken, user } =
			await this.authService.login(loginDto);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
		});
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
		});

		return new ResponseEntity(
			HttpStatus.OK,
			"로그인 성공",
			plainToInstance(TokenDto, {
				accessToken,
				refreshToken,
				user,
			}),
		);
	}

	@ApiResponseEntity(TokenDto, HttpStatus.OK)
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

		return plainToInstance(TokenDto, {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			user,
			mainTenantId: user.tenants?.find((tenant) => tenant.main)?.id || "",
		});
	}

	@Auth()
	@ApiResponse({ status: HttpStatus.OK, type: TokenDto })
	@Get("new-token")
	async getNewToken(
		@Req() req: Request & { user: UserDto },
		@Res({ passthrough: true }) res,
	): Promise<TokenDto> {
		const refreshToken = req.cookies.refreshToken;
		const { newAccessToken, newRefreshToken } =
			await this.authService.getNewToken(refreshToken);

		const user = req.user;

		const tenant = user.tenants?.find((tenant) => tenant.main);

		res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
		res.cookie("accessToken", newAccessToken, { httpOnly: true });
		res.cookie("mainTenantId", tenant?.id);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			mainTenantId: tenant?.id || "",
			user: req.user,
		};
	}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("sign-up")
	@ApiResponseEntity(TokenDto, HttpStatus.CREATED)
	async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
		return new ResponseEntity(
			HttpStatus.CREATED,
			"회원가입 성공",
			await this.authService.signUp(signUpDto),
		);
	}

	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get("verify-token")
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	async verifyToken() {
		const token = ContextProvider.getToken();
		const isValid = this.tokenService.verifyToken(token);
		return new ResponseEntity(HttpStatus.OK, "토큰 유효성 검증 완료", isValid);
	}

	@Auth()
	@HttpCode(HttpStatus.OK)
	@Post("logout")
	@ApiResponseEntity(Boolean, HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		// HttpOnly 쿠키들을 삭제
		res.clearCookie("accessToken", { httpOnly: true });
		res.clearCookie("refreshToken", { httpOnly: true });
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId", { httpOnly: true });

		return new ResponseEntity(HttpStatus.OK, "로그아웃 성공", true);
	}
}
