import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Request, Response } from "express";
import { AuthConfig } from "../../config";

export const Token = {
	ACCESS: "accessToken",
	REFRESH: "refreshToken",
};

type TokenValues = (typeof Token)[keyof typeof Token];

@Injectable()
export class TokenService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	getTokenFromRequest(req: Request, key?: TokenValues): string {
		const token = req.cookies[key || Token.ACCESS];
		if (!token) throw new BadRequestException(`${key}`);
		return req.cookies[key || Token.ACCESS];
	}

	setTokenToHTTPOnlyCookie(res: Response, key: TokenValues, value: string) {
		return res.cookie(key, value, { httpOnly: true });
	}

	generateAccessToken(payload: { userId: string }) {
		return this.jwtService.sign(payload);
	}

	generateRefreshToken(payload: { userId: string }) {
		const authConfig = this.configService.get<AuthConfig>("auth");
		return this.jwtService.sign(payload, {
			expiresIn: authConfig?.refresh as string,
		});
	}

	generateTokens(payload: { userId: string }) {
		return {
			accessToken: this.generateAccessToken(payload),
			refreshToken: this.generateRefreshToken(payload),
		};
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
