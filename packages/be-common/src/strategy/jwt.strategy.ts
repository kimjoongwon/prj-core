import { CONTEXT_KEYS } from "@cocrepo/constant";
import { hydrateEntity, User as UserEntity } from "@cocrepo/entity";
import type { User } from "@cocrepo/entity";
import { AuthCacheService, UserService } from "@cocrepo/service";
import type { AuthConfig } from "@cocrepo/type";
import {
	parseBigIntJson,
	stringifyBigIntJson,
} from "@cocrepo/type/bigint-json";
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

interface JwtHeader {
	alg?: string;
}

const parseJwtHeader = (token?: string): JwtHeader | null => {
	if (!token?.includes(".")) {
		return null;
	}

	try {
		return JSON.parse(
			Buffer.from(token.split(".")[0], "base64url").toString(),
		) as JwtHeader;
	} catch {
		return null;
	}
};

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		readonly config: ConfigService,
		readonly usersService: UserService,
		private readonly cls: ClsService,
		private readonly authCacheService: AuthCacheService,
	) {
		const oidcConfig = config.get<OidcServerConfig>("oidc");
		const authConfig = config.get<AuthConfig>("auth");
		const oidcIssuer = oidcConfig?.issuer || "http://localhost:3000";
		const jwksSecretProvider = jwksRsa.passportJwtSecret({
			jwksUri: oidcConfig?.jwksUri || "http://localhost:3000/oidc/jwks",
			cache: true,
			cacheMaxAge: 600000, // 10분
			rateLimit: true,
			jwksRequestsPerMinute: 10,
		});

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
					if (token?.includes(".")) {
						const header = parseJwtHeader(token);
						if (header?.alg !== "RS256") {
							return null;
						}
						this.cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					return null;
				},
			]),
			secretOrKeyProvider: (
				req: Request,
				token: string,
				done: (error: Error | null, secretOrKey?: string | Buffer) => void,
			) => {
				const header = parseJwtHeader(token);
				if (header?.alg === "HS256") {
					if (!authConfig?.secret) {
						return done(new Error("JWT secret is not defined."));
					}
					return done(null, authConfig.secret);
				}

				return jwksSecretProvider(req, token, done);
			},
			issuer: [oidcIssuer, `${oidcIssuer}/native`],
			algorithms: ["RS256", "HS256"],
		});
	}

	async validate(payload: {
		sub: string;
		iat: number;
		exp: number;
	}): Promise<User> {
		const userId = payload.sub;

		// 1. Redis 캐시 조회 (실패 시 null → DB fallback)
		const cached = await this.authCacheService.get(userId);
		if (cached) {
			this.logger.debug(`JWT 검증 - 캐시 히트: ${userId}`);
			// 내부 캐시는 API 필드 변환 없이 원본 값과 User 동작을 복원합니다.
			return hydrateEntity(
				UserEntity,
				parseBigIntJson<Partial<User>>(cached),
			);
		}

		// 2. 캐시 미스 → DB 조회
		this.logger.debug(`JWT 검증 - DB 조회: ${userId}`);
		const user = await this.usersService.findByUserIdWithTenants(userId);

		if (!user) {
			this.logger.warn(`사용자를 찾을 수 없음: ${userId}`);
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		// 3. Redis 캐시 저장 (실패해도 인증은 성공)
		const nowSeconds = Math.floor(Date.now() / 1000);
		const remainingSeconds = payload.exp - nowSeconds;
		await this.authCacheService.set(
			userId,
			stringifyBigIntJson(user),
			remainingSeconds,
		);

		return user;
	}
}
