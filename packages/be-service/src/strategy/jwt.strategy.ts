import { CONTEXT_KEYS } from "@cocrepo/constant";
import { User } from "@cocrepo/entity";
import { AuthCacheService, UserService } from "@cocrepo/service";
import type { AuthConfig } from "@cocrepo/type";
import {
	forwardRef,
	Global,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { Request } from "express";
import jwksRsa from "jwks-rsa";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { OidcServerConfig } from "./oidc-server-config";
import { parseJwtHeader } from "./parse-jwt-header";

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		readonly config: ConfigService,
		@Inject(forwardRef(() => UserService))
		readonly usersService: UserService,
		private readonly cls: ClsService,
		@Inject(forwardRef(() => AuthCacheService))
		private readonly authCacheService: AuthCacheService,
	) {
		const oidcConfig = config.get<OidcServerConfig>("oidc");
		const authConfig = config.get<AuthConfig>("auth");
		const oidcIssuer = oidcConfig?.issuer || "http://localhost:3007";
		const jwksSecretProvider = jwksRsa.passportJwtSecret({
			jwksUri: oidcConfig?.jwksUri || "http://localhost:3007/oidc/jwks",
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

	async validate(payload: { sub: string; iat: number; exp: number }) {
		const userId = payload.sub;

		// 1. Redis 캐시 조회 (실패 시 null → DB fallback)
		const cached = await this.authCacheService.get(userId);
		if (cached) {
			this.logger.debug(`JWT 검증 - 캐시 히트: ${userId}`);
			return plainToInstance(User, JSON.parse(cached));
		}

		// 2. 캐시 미스 → DB 조회
		this.logger.debug(`JWT 검증 - DB 조회: ${userId}`);
		const user = await this.usersService.getByIdWithTenants(userId);

		if (!user) {
			this.logger.warn(`사용자를 찾을 수 없음: ${userId}`);
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		// 3. Redis 캐시 저장 (실패해도 인증은 성공)
		const nowSeconds = Math.floor(Date.now() / 1000);
		const remainingSeconds = payload.exp - nowSeconds;
		await this.authCacheService.set(
			userId,
			JSON.stringify(user),
			remainingSeconds,
		);

		return user;
	}
}
