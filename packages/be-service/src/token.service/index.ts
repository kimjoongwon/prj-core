import { CONTEXT_KEYS, Token, TokenValues } from "@cocrepo/constant";
import { AuthConfig } from "@cocrepo/type";
import { Cookie } from "@cocrepo/vo";
import {
	BadRequestException,
	Injectable,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { ClsService } from "nestjs-cls";
import { TokenStorageService } from "../token-storage.service/index";

/**
 * 토큰 관리 서비스
 * IDP에서 발급한 토큰의 쿠키 설정/삭제 및 블랙리스트 관리
 */
@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name);

	constructor(
		private configService: ConfigService,
		private tokenStorageService: TokenStorageService,
		private cls: ClsService,
	) {}

	getTokenFromRequest(req: Request, key?: TokenValues): string {
		const token = req.cookies[key || Token.ACCESS];
		if (!token) throw new BadRequestException(`${key}`);
		return req.cookies[key || Token.ACCESS];
	}

	setTokenToHTTPOnlyCookie(res: Response, key: TokenValues, value: string) {
		const authConfig = this.configService.get<AuthConfig>("auth");
		if (!authConfig) {
			throw new Error("Auth configuration is not defined.");
		}

		const expiresIn =
			key === Token.ACCESS ? authConfig.expires : authConfig.refresh;
		const cookie = Cookie.forToken(expiresIn);

		return res.cookie(key, value, cookie.toExpressOptions());
	}

	/**
	 * Access Token 쿠키 설정
	 */
	setAccessTokenCookie(res: Response, accessToken: string) {
		return this.setTokenToHTTPOnlyCookie(res, Token.ACCESS, accessToken);
	}

	/**
	 * Refresh Token 쿠키 설정
	 */
	setRefreshTokenCookie(res: Response, refreshToken: string) {
		return this.setTokenToHTTPOnlyCookie(res, Token.REFRESH, refreshToken);
	}

	/**
	 * 쿠키 삭제
	 */
	clearTokenCookies(res: Response) {
		const authConfig = this.configService.get<AuthConfig>("auth");
		if (!authConfig) {
			throw new Error("Auth configuration is not defined.");
		}

		const accessCookie = Cookie.forToken(authConfig.expires);
		const refreshCookie = Cookie.forToken(authConfig.refresh);

		res.clearCookie(Token.ACCESS, accessCookie.toExpressOptions());
		res.clearCookie(Token.REFRESH, refreshCookie.toExpressOptions());
	}

	/**
	 * Access Token이 블랙리스트에 있는지 확인
	 */
	async isTokenBlacklisted(accessToken: string): Promise<boolean> {
		return this.tokenStorageService.isBlacklisted(accessToken);
	}
}
