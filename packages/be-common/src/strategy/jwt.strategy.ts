import { CONTEXT_KEYS } from "@cocrepo/constant";
import { UsersService } from "@cocrepo/service";
import {
	Global,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import jwksRsa from "jwks-rsa";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";

interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
	clientId: string;
	clientSecret: string;
}

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		readonly config: ConfigService,
		readonly usersService: UsersService,
		private readonly cls: ClsService,
	) {
		const oidcConfig = config.get<OidcServerConfig>("oidc");

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				// Authorization Bearer 헤더에서 토큰 추출 (Swagger 등 우선)
				(req: Request) => {
					const authHeader = req.headers?.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						const token = authHeader.split(" ")[1];
						this.cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					return null;
				},
				// 쿠키에서 토큰 추출 (RS256 JWT만 허용)
				(req: Request) => {
					const token = req.cookies?.accessToken;
					if (token && token.includes(".")) {
						try {
							const header = JSON.parse(
								Buffer.from(token.split(".")[0], "base64url").toString(),
							);
							if (header.alg !== "RS256") return null;
						} catch {
							return null;
						}
						this.cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					return null;
				},
			]),
			// JWKS 기반 RS256 검증 (IDP의 공개키로 토큰 검증)
			secretOrKeyProvider: jwksRsa.passportJwtSecret({
				jwksUri: oidcConfig?.jwksUri || "http://localhost:3007/oidc/jwks",
				cache: true,
				cacheMaxAge: 600000, // 10분
				rateLimit: true,
				jwksRequestsPerMinute: 10,
			}),
			issuer: oidcConfig?.issuer || "http://localhost:3007",
			algorithms: ["RS256"],
		});
	}

	async validate(payload: { sub: string; iat: number; exp: number }) {
		this.logger.debug(`JWT 검증 - sub: ${payload.sub}`);

		const user = await this.usersService.getByIdWithTenants(payload.sub);

		if (!user) {
			this.logger.warn(`사용자를 찾을 수 없음: ${payload.sub}`);
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		return user;
	}
}
