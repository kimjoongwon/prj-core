import { Token, type TokenValues } from "@cocrepo/constants";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Request, Response } from "express";
import { AuthConfig } from "../../config";
import {
	getAccessTokenCookieOptions,
	getRefreshTokenCookieOptions,
} from "../../utils/cookie.util";
import { TokenStorageService } from "./token-storage.service";

@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name);

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private tokenStorageService: TokenStorageService,
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

		const options =
			key === Token.ACCESS
				? getAccessTokenCookieOptions(authConfig.expires)
				: getRefreshTokenCookieOptions(authConfig.refresh);

		return res.cookie(key, value, options);
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
	 * 쿠키 삭제 (clearCookie와 동일한 옵션 사용)
	 */
	clearTokenCookies(res: Response) {
		const authConfig = this.configService.get<AuthConfig>("auth");
		if (!authConfig) {
			throw new Error("Auth configuration is not defined.");
		}

		const accessOptions = getAccessTokenCookieOptions(authConfig.expires);
		const refreshOptions = getRefreshTokenCookieOptions(authConfig.refresh);

		res.clearCookie(Token.ACCESS, accessOptions);
		res.clearCookie(Token.REFRESH, refreshOptions);
	}

	generateAccessToken(payload: { userId: string }) {
		return this.jwtService.sign(payload);
	}

	generateRefreshToken(payload: { userId: string }) {
		const authConfig = this.configService.get<AuthConfig>("auth");
		if (!authConfig?.refresh) {
			throw new Error("JWT refresh expiration is not defined.");
		}
		return this.jwtService.sign(payload, {
			expiresIn: authConfig.refresh as any,
		});
	}

	generateTokens(payload: { userId: string }) {
		return {
			accessToken: this.generateAccessToken(payload),
			refreshToken: this.generateRefreshToken(payload),
		};
	}

	/**
	 * 토큰 생성 및 Redis에 Refresh Token 저장
	 */
	async generateTokensWithStorage(payload: { userId: string }) {
		const tokens = this.generateTokens(payload);
		await this.tokenStorageService.saveRefreshToken(
			payload.userId,
			tokens.refreshToken,
		);
		this.logger.debug(`토큰 생성 및 Redis 저장 완료: userId=${payload.userId}`);
		return tokens;
	}

	/**
	 * Refresh Token 검증 (Redis에서 확인)
	 */
	async validateRefreshTokenFromStorage(
		userId: string,
		refreshToken: string,
	): Promise<boolean> {
		return this.tokenStorageService.validateRefreshToken(userId, refreshToken);
	}

	/**
	 * 토큰 무효화 (로그아웃)
	 */
	async invalidateTokens(userId: string, accessToken?: string): Promise<void> {
		// Refresh Token 삭제
		await this.tokenStorageService.deleteRefreshToken(userId);

		// Access Token을 블랙리스트에 추가 (선택적)
		if (accessToken) {
			await this.tokenStorageService.addToBlacklist(accessToken);
		}

		this.logger.debug(`토큰 무효화 완료: userId=${userId}`);
	}

	/**
	 * Access Token이 블랙리스트에 있는지 확인
	 */
	async isTokenBlacklisted(accessToken: string): Promise<boolean> {
		return this.tokenStorageService.isBlacklisted(accessToken);
	}

	validateToken(token: string) {
		try {
			return this.jwtService.verify(token);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new BadRequestException("토튼 만료 에러");
			}

			if (error instanceof NotBeforeError) {
				throw new BadRequestException("토큰 미사용");
			}

			throw new InternalServerErrorException("알 수 없는 에러");
		}
	}

	verifyToken(token: string) {
		try {
			this.validateToken(token);
			return true;
		} catch (_error) {
			return false;
		}
	}
}
